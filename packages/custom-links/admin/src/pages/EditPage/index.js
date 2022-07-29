import React, { useState, useCallback, useEffect } from 'react';
import { LoadingIndicatorPage, useNotification, useQueryParams } from '@strapi/helper-plugin';
import { get } from 'lodash';
import { Main } from '@strapi/design-system/Main';
import { Box } from '@strapi/design-system/Box';
import { Link } from '@strapi/design-system/Link';
import { Flex } from '@strapi/design-system/Flex';
import { ArrowLeft } from '@strapi/icons';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Searchbar, SearchForm } from '@strapi/design-system/Searchbar';
import useCustomLinks from '../../hooks/useCustomLinks';
import useAllContentTypes from '../../hooks/useAllContentTypes';
import ListView from '../../components/ListView';
import { deleteCustomLinks, deleteCustomLink } from '../../utils/api';

const qs = require('qs');

const EditPage = () => {
  const toggleNotification = useNotification();
  const { replace } = useHistory();
  const [{ query, rawQuery }] = useQueryParams();
  const [search, setSearch] = useState(query && query._q ? query._q : '');
  const {
    data: customLinksData,
    isLoading: isCustomLinksLoading,
    err: customLinksErr,
    refetch,
  } = useCustomLinks(query);
  const {
    data: allContentTypesData,
    isLoading: isContentTypesLoading,
    err: contentTypesErr,
  } = useAllContentTypes();

  const isLoading = isCustomLinksLoading || isContentTypesLoading;
  const isError = customLinksErr || contentTypesErr;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!rawQuery) {
      replace('/plugins/custom-links?page=1&pageSize=10');
    }
  }, [rawQuery, replace]);

  const handleSubmitSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    const newQuery = { ...query, _q: search };
    const qureyString = qs.stringify(newQuery, { encodeValuesOnly: true });
    replace(`/plugins/custom-links?${qureyString}`);
  };
  const clearSearch = () => {
    setSearch('');
    let newQuery = { ...query };
    delete newQuery._q;
    const qureyString = qs.stringify(newQuery, { encodeValuesOnly: true });
    replace(`/plugins/custom-links?${qureyString}`);
  };
  const getHeader = () => {
    return (
      <Box background="neutral100">
        <BaseHeaderLayout
          navigationAction={
            <Link starticon={<ArrowLeft />} to="/">
              Go back
            </Link>
          }
          title="Custom Links"
          subtitle={
            isLoading || isError
              ? ''
              : formatMessage(
                  { id: 'custom-links.pages.settings.custom-links.count' },
                  { total: customLinksData.meta.pagination.total }
                )
          }
          as="h2"
        />
      </Box>
    );
  };

  const handleConfirmDeleteAllData = useCallback(
    async ids => {
      try {
        await deleteCustomLinks({ ids });
        refetch();
      } catch (err) {
        toggleNotification({
          type: 'warning',
          message: { id: 'custom-links.pages.settings.error.record.delete' },
        });
      }
    },
    [refetch, toggleNotification]
  );

  const handleConfirmDeleteData = useCallback(
    async idToDelete => {
      try {
        await deleteCustomLink(idToDelete);
        refetch();
        toggleNotification({
          type: 'success',
          message: { id: 'custom-links.pages.settings.success.record.delete' },
        });
      } catch (err) {
        const errorMessage = get(
          err,
          'response.payload.message',
          formatMessage({ id: 'custom-links.pages.settings.error.record.delete' })
        );

        toggleNotification({
          type: 'warning',
          message: errorMessage,
        });
      }
    },
    [formatMessage, refetch, toggleNotification]
  );

  if (isLoading || isError) {
    return (
      <>
        {getHeader()}
        <LoadingIndicatorPage>
          {formatMessage({ id: 'custom-links.pages.edit.fetching' })}
        </LoadingIndicatorPage>
      </>
    );
  }

  return (
    <>
      {getHeader()}
      <Main labelledBy="title">
        <Box padding={8} paddingBottom={1} background="neutral100">
          <Flex alignItems="flex-end" justifyContent="space-between">
            <SearchForm size={3} as="form" onSubmit={handleSubmitSearch}>
              <Searchbar
                name="search"
                onClear={clearSearch}
                value={search}
                onChange={e => setSearch(e.target.value)}
                clearLabel={formatMessage({
                  id: 'custom-links.pages.settings.custom-links.search.label',
                })}
                placeholder={formatMessage({
                  id: 'custom-links.pages.settings.custom-links.search.placeholder',
                })}
              >
                {formatMessage({ id: 'custom-links.pages.settings.custom-links.searching' })}
              </Searchbar>
            </SearchForm>
          </Flex>
        </Box>
        <ListView
          onConfirmDeleteAll={handleConfirmDeleteAllData}
          onConfirmDelete={handleConfirmDeleteData}
          pagination={customLinksData.meta.pagination}
          customLinks={customLinksData.data}
          contentTypes={allContentTypesData}
          onReload={refetch}
        />
      </Main>
    </>
  );
};

export default EditPage;
