import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { Button } from '@strapi/design-system/Button';
import { useIntl } from 'react-intl';
import Trash from '@strapi/icons/Trash';

const DeleteHeader = ({ entriesToDelete, onDeleteConfirm }) => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={8} paddingBottom={0}>
      <Flex alignItems="center" justifyContent="left" gap={2}>
        <Typography variant="omega" textColor="neutral600">
          {formatMessage(
            {
              id: 'custom-links.pages.settings.custom-links.to.delete',
              defaultMessage:
                '{entriesToDeleteLength, plural, one {# custom-link} other {# custom-links}} selected',
            },
            { entriesToDeleteLength: entriesToDelete.length }
          )}
        </Typography>
        <Box paddingLeft={2}>
          <Button variant="danger-light" onClick={onDeleteConfirm} startIcon={<Trash />}>
            {formatMessage({
              id: 'custom-links.components.edit.button.delete',
              defaultMessage: 'Delete',
            })}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

DeleteHeader.defaultProps = {};

DeleteHeader.propTypes = {
  entriesToDelete: PropTypes.array.isRequired,
  onDeleteConfirm: PropTypes.func.isRequired,
};

export default DeleteHeader;
