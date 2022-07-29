import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@strapi/design-system/Box';
import { NavLink } from 'react-router-dom';
import { Flex } from '@strapi/design-system/Flex';
import { Trash, Pencil, Link as IconLink } from '@strapi/icons';
import { IconButton } from '@strapi/design-system/IconButton';
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import { Typography } from '@strapi/design-system/Typography';
import { Table, Tr, Td, Tbody } from '@strapi/design-system/Table';
import { useIntl } from 'react-intl';
import { stopPropagation, onRowClick } from '@strapi/helper-plugin';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import { find } from 'lodash';
import EditModal from './EditModal';
import PaginationFooter from './PaginationFooter';
import DeleteHeader from './DeleteHeader';
import ConfirmDialogDeleteAll from './ConfirmDialogDeleteAll';
import ConfirmDialogDelete from './ConfirmDialogDelete';
import { Perma } from '../../assets/Perma';
import TableHead from './TableHead';

const ListView = ({
  contentTypes,
  pagination,
  customLinks,
  onReload,
  onConfirmDeleteAll,
  onConfirmDelete,
}) => {
  const ROW_COUNT = 6;
  const headers = [
    { name: 'id', metadatas: { sortable: true, label: 'id' } },
    { name: 'uri', metadatas: { sortable: true, label: 'uri' } },
    { name: 'kind', metadatas: { sortable: true, label: 'content type' } },
    { name: 'contentId', metadatas: { sortable: true, label: 'content id' } },
  ];
  const { formatMessage } = useIntl();
  const [entriesToDelete, setEntriesToDelete] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isConfirmButtonLoading, setIsConfirmButtonLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) =>
    first.toLocaleUpperCase(locale) + rest.join('');
  const areAllEntriesSelected =
    entriesToDelete.length === customLinks.length && customLinks.length > 0;
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    onReload();
  };

  const handleConfirmDeleteAll = async () => {
    try {
      setIsConfirmButtonLoading(true);
      await onConfirmDeleteAll(entriesToDelete);
      handleToggleConfirmDeleteAll();
      setEntriesToDelete([]);
      setIsConfirmButtonLoading(false);
    } catch (err) {
      setIsConfirmButtonLoading(false);
      handleToggleConfirmDeleteAll();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsConfirmButtonLoading(true);
      await onConfirmDelete(entriesToDelete[0]);
      handleToggleConfirmDelete();
      setIsConfirmButtonLoading(false);
    } catch (err) {
      setIsConfirmButtonLoading(false);
      handleToggleConfirmDelete();
    }
  };

  const handleSelectAll = () => {
    if (!areAllEntriesSelected) {
      setEntriesToDelete(customLinks.map(row => row.id));
    } else {
      setEntriesToDelete([]);
    }
  };

  const handleEditRow = ({ kind, contentId, id }) => {
    setEdit({ kind, contentId, id });
    setShowEditModal(true);
  };

  const handleSelectRow = ({ name, value }) => {
    setEntriesToDelete(prev => {
      if (value) {
        return prev.concat(name);
      }

      return prev.filter(id => id !== name);
    });
  };

  const handleClickDelete = id => {
    setEntriesToDelete([id]);
    handleToggleConfirmDelete();
  };

  const handleToggleConfirmDeleteAll = () => {
    setShowConfirmDeleteAll(prev => !prev);
  };

  const handleToggleConfirmDelete = () => {
    setShowConfirmDelete(prev => !prev);
  };

  const getEmptyRow = () => {
    return (
      <Tr>
        <Td colSpan={ROW_COUNT}>
          <EmptyStateLayout
            icon={<Perma />}
            content={formatMessage({ id: 'custom-links.pages.settings.empty' })}
            shadow="none"
          />
        </Td>
      </Tr>
    );
  };

  const getRows = () => {
    return customLinks.map(entry => {
      const isChecked = entriesToDelete.findIndex(id => id === entry.id) !== -1;
      const contentType = find(contentTypes, ct => ct.uid === entry.attributes.kind);
      const kindDisplayName = capitalizeFirstLetter(contentType.info.displayName);

      return (
        <Tr
          key={entry.id}
          {...onRowClick({
            fn: () => {
              handleEditRow({ id: entry.id, ...entry.attributes });
            },
          })}
        >
          <Td {...stopPropagation}>
            <BaseCheckbox
              checked={isChecked}
              onChange={() => {
                handleSelectRow({ name: entry.id, value: !isChecked });
              }}
              aria-label={`Select ${entry.id}`}
            />
          </Td>
          <Td>
            <Typography textColor="neutral800">{entry.id}</Typography>
          </Td>
          <Td>
            <Typography textColor="neutral800">{entry.attributes.uri}</Typography>
          </Td>
          <Td>
            <Typography textColor="neutral800">{kindDisplayName}</Typography>
          </Td>
          <Td>
            <Typography textColor="neutral800">{entry.attributes.contentId}</Typography>
          </Td>
          <Td>
            <Flex justifyContent="end" {...stopPropagation}>
              <Box paddingLeft={1}>
                <IconButton
                  as={NavLink}
                  to={`/content-manager/collectionType/${entry.attributes.kind}/${entry.attributes.contentId}`}
                  label={formatMessage({ id: 'custom-links.pages.settings.label.view' })}
                  noBorder
                  icon={<IconLink />}
                />
              </Box>
              <Box paddingLeft={1}>
                <IconButton
                  onClick={() => handleEditRow({ id: entry.id, ...entry.attributes })}
                  label={formatMessage({ id: 'custom-links.pages.settings.label.edit' })}
                  noBorder
                  icon={<Pencil />}
                />
              </Box>
              <Box paddingLeft={1}>
                <IconButton
                  onClick={() => handleClickDelete(entry.id)}
                  label={formatMessage({ id: 'custom-links.pages.settings.label.delete' })}
                  noBorder
                  icon={<Trash />}
                />
              </Box>
            </Flex>
          </Td>
        </Tr>
      );
    });
  };

  return (
    <>
      {showEditModal && (
        <EditModal
          onClose={handleCloseEditModal}
          id={edit.id}
          kind={edit.kind}
          contentId={edit.contentId}
        />
      )}
      {entriesToDelete.length > 0 && (
        <DeleteHeader
          entriesToDelete={entriesToDelete}
          onDeleteConfirm={handleToggleConfirmDeleteAll}
        />
      )}
      <Box padding={8} background="neutral100">
        <Table colCount={customLinks.length} rowCount={ROW_COUNT}>
          <TableHead
            areAllEntriesSelected={areAllEntriesSelected}
            entriesToDelete={entriesToDelete}
            headers={headers}
            onSelectAll={handleSelectAll}
            withMainAction
            withBulkActions
          />
          <Tbody>{!customLinks.length ? getEmptyRow() : getRows()}</Tbody>
        </Table>
        <PaginationFooter pagination={pagination} />
      </Box>
      <ConfirmDialogDeleteAll
        isConfirmButtonLoading={isConfirmButtonLoading}
        onConfirm={handleConfirmDeleteAll}
        onToggleDialog={handleToggleConfirmDeleteAll}
        isOpen={showConfirmDeleteAll}
      />
      <ConfirmDialogDelete
        isConfirmButtonLoading={isConfirmButtonLoading}
        onConfirm={handleConfirmDelete}
        onToggleDialog={handleToggleConfirmDelete}
        isOpen={showConfirmDelete}
      />
    </>
  );
};

ListView.propTypes = {
  contentTypes: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  customLinks: PropTypes.array.isRequired,
  onReload: PropTypes.func.isRequired,
  onConfirmDeleteAll: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
};

export default ListView;
