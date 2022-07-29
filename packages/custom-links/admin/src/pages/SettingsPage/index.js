import React, { useState, useEffect, useCallback } from 'react';

import { isEqual } from 'lodash';
import {
  CheckPagePermissions,
  useNotification,
  LoadingIndicatorPage,
  Form,
  useAutoReloadOverlayBlocker,
  SettingsPageTitle,
} from '@strapi/helper-plugin';
import { Main } from '@strapi/design-system/Main';
import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Select, Option } from '@strapi/design-system/Select';
import { Check } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import useCustomLinksConfig from '../../hooks/useCustomLinksConfig';
import useAllContentTypes from '../../hooks/useAllContentTypes';
import useAppInfo from '../../hooks/useAppInfo';
import pluginPermissions from '../../permissions';
import SettingsConfirmDialog from '../../components/SettingsConfirmDialog';

const ProtectedSettingsPage = () => (
  <CheckPagePermissions permissions={pluginPermissions.settings.read}>
    <SettingsPage />
  </CheckPagePermissions>
);

const SettingsPage = () => {
  const toggleNotification = useNotification();
  const { lockAppWithAutoreload, unlockAppWithAutoreload } = useAutoReloadOverlayBlocker();
  const {
    data: pluginConfig,
    isLoading: isConfigLoading,
    err: configErr,
    submitMutation,
    forceRefetch,
  } = useCustomLinksConfig();
  const {
    data: allContentTypes,
    isLoading: isContentTypesLoading,
    err: contentTypesErr,
  } = useAllContentTypes();
  const { data: appInfo, isLoading: isAppInfoLoading, err: appInfoErr } = useAppInfo();
  const isLoading = isConfigLoading || isContentTypesLoading || isAppInfoLoading;
  const isError = configErr || contentTypesErr || appInfoErr;
  const [isModified, setIsModified] = useState(false);
  const [newConfig, setNewConfig] = useState(null);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const { formatMessage } = useIntl();
  const boxDefaultProps = {
    background: 'neutral0',
    hasRadius: true,
    shadow: 'filterShadow',
    padding: 6,
  };

  useEffect(() => {
    if (!appInfo) return;

    if (!appInfo.autoReload) {
      toggleNotification({
        type: 'info',
        message: { id: 'custom-links.pages.settings.autoReload.information' },
      });
    }
  }, [appInfo, toggleNotification]);

  const preparePayload = ({ selectedContentTypes }) => ({
    contentTypes: selectedContentTypes,
  });

  const handleClickSave = values => {
    const olds = selectedContentTypes.filter(ct => !values?.selectedContentTypes?.includes(ct));
    setNewConfig(values);

    if (olds.length > 0) {
      handleToggleConfirmSave();
    } else {
      save(values);
    }
  };

  const save = useCallback(
    async values => {
      try {
        lockAppWithAutoreload();
        const payload = preparePayload(values);
        await submitMutation({ body: payload });
        setIsModified(false);
        await forceRefetch();
      } catch (err) {
        toggleNotification({
          type: 'warning',
          message: { id: 'notification.error' },
        });
      } finally {
        unlockAppWithAutoreload();
      }
    },
    [
      forceRefetch,
      lockAppWithAutoreload,
      submitMutation,
      toggleNotification,
      unlockAppWithAutoreload,
    ]
  );

  const handleToggleConfirmSave = () => {
    setShowConfirmSave(prev => !prev);
  };

  const handleConfirmSave = async () => {
    try {
      handleToggleConfirmSave();
      await save(newConfig);
    } catch (err) {
      handleToggleConfirmSave();
    }
  };

  if (isLoading || isError) {
    return (
      <>
        <SettingsPageTitle
          name={formatMessage({ id: 'custom-links.plugin.name', defaultMessage: 'Custom Links' })}
        />
        <LoadingIndicatorPage>
          {formatMessage({
            id: 'custom-links.pages.settings.fetching',
            defaultMessage: 'Fetching',
          })}
        </LoadingIndicatorPage>
      </>
    );
  }

  const { autoReload } = appInfo;
  const filteredContentTypes = Object.values(allContentTypes).filter(item => {
    return item?.uid?.includes('api::');
  });
  const selectedContentTypes = pluginConfig.contentTypes.map(item => item.uid);

  return (
    <>
      <SettingsPageTitle
        name={formatMessage({ id: 'custom-links.plugin.name', defaultMessage: 'Custom Links' })}
      />
      <Main labelledBy="title">
        <Formik
          initialValues={{
            selectedContentTypes,
          }}
          onSubmit={handleClickSave}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <HeaderLayout
                title={formatMessage({
                  id: 'custom-links.pages.settings.header.title',
                  defaultMessage: 'Configuration',
                })}
                subtitle={formatMessage({
                  id: 'custom-links.pages.settings.header.description',
                  defaultMessage: 'Add Content-Types',
                })}
                primaryAction={
                  autoReload ? (
                    <Button disabled={!isModified} type="submit" startIcon={<Check />}>
                      {formatMessage({
                        id: 'custom-links.pages.settings.actions.submit',
                        defaultMessage: 'Submit',
                      })}
                    </Button>
                  ) : null
                }
              />
              <ContentLayout>
                <Stack spacing={7}>
                  <Box {...boxDefaultProps}>
                    <Stack spacing={4}>
                      <Typography variant="delta" as="h2">
                        {formatMessage({
                          id: 'custom-links.pages.settings.general.title',
                          defaultMessage: 'title',
                        })}
                      </Typography>
                      <Grid gap={4}>
                        <GridItem col={12} s={12} xs={12}>
                          <Select
                            name="selectedContentTypes"
                            label={formatMessage({
                              id: 'custom-links.pages.settings.form.contentTypes.label',
                              defaultMessage: 'label',
                            })}
                            placeholder={formatMessage({
                              id: 'custom-links.pages.settings.form.contentTypes.placeholder',
                              defaultMessage: 'placeholder',
                            })}
                            hint={formatMessage({
                              id: 'custom-links.pages.settings.form.contentTypes.hint',
                              defaultMessage: 'hint',
                            })}
                            onClear={() => setFieldValue('selectedContentTypes', [], false)}
                            value={values.selectedContentTypes}
                            onChange={value => {
                              setFieldValue('selectedContentTypes', value, false);
                              setIsModified(!isEqual(value, selectedContentTypes));
                            }}
                            multi
                            withTags
                            disabled={!autoReload}
                          >
                            {filteredContentTypes.map(item => (
                              <Option key={item.uid} value={item.uid}>
                                {item.info.displayName}
                              </Option>
                            ))}
                          </Select>
                        </GridItem>
                      </Grid>
                    </Stack>
                  </Box>
                </Stack>
              </ContentLayout>
            </Form>
          )}
        </Formik>
      </Main>
      <SettingsConfirmDialog
        onConfirm={handleConfirmSave}
        onToggleDialog={handleToggleConfirmSave}
        isOpen={showConfirmSave}
      />
    </>
  );
};

export default ProtectedSettingsPage;
