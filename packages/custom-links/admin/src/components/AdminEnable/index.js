import React from 'react';
import { CheckPermissions } from '@strapi/helper-plugin';
import { LinkButton } from '@strapi/design-system/LinkButton';
import { useIntl } from 'react-intl';
import { Link as IconLink } from '@strapi/icons';
import useAppInfo from '../../hooks/useAppInfo';

const permissions = [{ action: 'plugin::custom-links.settings.read', subject: null }];

const AdminEnable = () => {
  const { formatMessage } = useIntl();
  const { data: appInfo, isLoading, err } = useAppInfo();

  if (isLoading || err || !appInfo || !appInfo.autoReload) return null;

  const url = '/settings/custom-links';

  return (
    <CheckPermissions permissions={permissions}>
      <LinkButton to={url} startIcon={<IconLink />} variant="secondary">
        {formatMessage({
          id: 'custom-links.components.enable.link-to-ctb',
          defaultMessage: 'Configure custom links plugin',
        })}
      </LinkButton>
    </CheckPermissions>
  );
};

export default AdminEnable;
