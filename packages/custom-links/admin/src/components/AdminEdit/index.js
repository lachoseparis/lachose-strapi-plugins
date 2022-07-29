import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system/Box';
import { Loader } from '@strapi/design-system/Loader';
import { Field, FieldInput, FieldLabel } from '@strapi/design-system/Field';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import CheckCircle from '@strapi/icons/CheckCircle';
import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';
import { getCustomLinkByKindAndId } from '../../utils/api';
import useCheckAvailability from '../../hooks/useCheckAvailability';
import useDebounce from '../../hooks/useDebounce';
import { FeedbackWrapper, TextValidation } from './feedbackStyle';
import { URI_REGEXP } from '../../utils/regexp';

const AdminEdit = ({ kind, contentId }) => {
  const { formatMessage } = useIntl();
  const [hasError, setHasError] = useState(false);
  const [savedUri, setSavedUri] = useState('');
  const [modifiedUriCalled, setModifiedUriCalled] = useState('');
  const [previousStatus, setPreviousStatus] = useState('resolved');
  const [uri, setURI] = useState('');
  const { onChange, status } = useCMEditViewDataManager();
  const { check: checkAvailability, available, clearCheck, isChecking } = useCheckAvailability();
  const debouncedURI = useDebounce(uri, 300);

  const fetchURI = useCallback(async () => {
    const result = await getCustomLinkByKindAndId({ kind, contentId });
    const uri = result?.attributes?.uri;

    if (uri) {
      setURI(uri);
      setSavedUri(uri);
      setHasError(false);
      clearCheck();
    }
  }, [kind, contentId, clearCheck]);

  useEffect(() => {
    fetchURI();
  }, [fetchURI]);

  const setModifiedUri = useCallback(
    uri => {
      setModifiedUriCalled(uri);
      onChange({
        target: { name: 'uri', value: uri },
      });
    },
    [onChange]
  );

  useEffect(() => {
    if (previousStatus !== status) {
      if (previousStatus === 'submit-pending') {
        fetchURI();
      }
      setPreviousStatus(status);
    }
  }, [previousStatus, status, fetchURI]);

  useEffect(() => {
    if (debouncedURI && debouncedURI !== savedUri && !hasError) {
      checkAvailability({
        uri: debouncedURI,
        kind,
        contentId,
      });
    }
  }, [debouncedURI, savedUri, hasError, kind, contentId, checkAvailability]);

  useEffect(() => {
    if (available && available.isAvailable && available.uri === debouncedURI) {
      if (modifiedUriCalled !== available.uri) setModifiedUri(available.uri);
    } else if (hasError || !available.isAvailable) {
      if (modifiedUriCalled !== savedUri) setModifiedUri(savedUri);
    }
  }, [available, debouncedURI, hasError, modifiedUriCalled, onChange, savedUri, setModifiedUri]);

  const handleChange = e => {
    setURI(e.target.value);
    setHasError(!URI_REGEXP.test(e.target.value));
  };

  return (
    <>
      <Box paddinTop={1} paddingBottom={1}>
        <Field
          name="uri"
          hint={formatMessage({ id: 'custom-links.components.edit.inputs.uri.hint' })}
        >
          <Stack spacing={1}>
            <FieldLabel>
              {formatMessage({ id: 'custom-links.components.edit.inputs.uri.label' })}
            </FieldLabel>
            <FieldInput
              placeholder={formatMessage({
                id: 'custom-links.components.edit.inputs.uri.placeholder',
              })}
              type="text"
              value={uri}
              onChange={e => handleChange(e)}
            />
          </Stack>
        </Field>
        <Box paddinTop={1} paddingBottom={1} style={{ minHeight: 20, marginTop: 5 }}>
          <FeedbackWrapper>
            {!isChecking && hasError && (
              <TextValidation notAvailable alignItems="center" justifyContent="flex-end">
                <ExclamationMarkCircle />
                <Typography textColor="danger600" variant="pi">
                  {formatMessage({
                    id: 'custom-links.components.edit.feedback.error',
                    defaultMessage: 'incorrect format',
                  })}
                </Typography>
              </TextValidation>
            )}
            {!hasError &&
              !isChecking &&
              available &&
              available.isAvailable &&
              uri !== '' &&
              uri !== savedUri &&
              debouncedURI === uri && (
                <TextValidation alignItems="center" justifyContent="flex-end">
                  <CheckCircle />
                  <Typography id="custom-link-feedback" textColor="success600" variant="pi">
                    {formatMessage({
                      id: 'custom-links.components.edit.feedback.available',
                      defaultMessage: 'Available',
                    })}
                  </Typography>
                </TextValidation>
              )}
            {!hasError &&
              !isChecking &&
              available &&
              !available.isAvailable &&
              uri !== '' &&
              uri !== savedUri &&
              debouncedURI === uri && (
                <TextValidation notAvailable alignItems="center" justifyContent="flex-end">
                  <ExclamationMarkCircle />
                  <Typography id="custom-link-feedback" textColor="danger600" variant="pi">
                    {formatMessage({
                      id: 'custom-links.components.edit.feedback.unavailable',
                      defaultMessage: 'Unavailable',
                    })}
                  </Typography>
                </TextValidation>
              )}
            {!hasError && (isChecking || (debouncedURI !== uri && uri !== savedUri)) && (
              <TextValidation notAvailable alignItems="center" justifyContent="flex-end">
                <Loader small>...</Loader>
                <Typography textColor="primary600" variant="pi">
                  {formatMessage({
                    id: 'custom-links.components.edit.feedback.checking',
                    defaultMessage: 'Checking availability',
                  })}
                </Typography>
              </TextValidation>
            )}
          </FeedbackWrapper>
        </Box>
      </Box>
    </>
  );
};
AdminEdit.defaultProps = {
  contentId: null,
};

AdminEdit.propTypes = {
  kind: PropTypes.string.isRequired,
  contentId: PropTypes.string,
};

export default AdminEdit;
