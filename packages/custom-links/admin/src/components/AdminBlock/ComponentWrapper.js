import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system/Box';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import { useIntl } from 'react-intl';
import { Link as IconLink } from '@strapi/icons';
import { Flex } from '@strapi/design-system/Flex';
import Information from '@strapi/icons/Information';
import { Icon } from '@strapi/design-system/Icon';
import { Tooltip } from '@strapi/design-system/Tooltip';

const ComponentWrapper = ({ children, enabled = true }) => {
  const { formatMessage } = useIntl();
  const iconSize = {
    width: 12,
    height: 12,
  };

  return (
    <Box
      as="aside"
      aria-labelledby="Custom Link"
      background={enabled ? 'neutral0' : 'neutral100'}
      borderColor="neutral150"
      hasRadius
      paddingBottom={4}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={6}
      shadow="tableShadow"
    >
      <Box>
        <Flex>
          <Box paddingRight={2}>
            <IconLink style={iconSize} />
          </Box>
          <Typography variant="sigma" textColor="neutral600" id="custom-link">
            {formatMessage({ id: 'custom-links.components.edit.header.title' })}
          </Typography>
          <Tooltip description={formatMessage({ id: 'custom-links.components.edit.description' })}>
            <Icon
              paddingLeft={1}
              width={`${12 / 16}rem`}
              height={`${12 / 16}rem`}
              color="primary700"
              as={Information}
            />
          </Tooltip>
        </Flex>

        <Box paddingTop={2} paddingBottom={6}>
          <Divider />
        </Box>
        {children}
      </Box>
    </Box>
  );
};
ComponentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  enabled: PropTypes.bool,
};
ComponentWrapper.defaultProps = {
  enabled: true,
};
export default ComponentWrapper;
