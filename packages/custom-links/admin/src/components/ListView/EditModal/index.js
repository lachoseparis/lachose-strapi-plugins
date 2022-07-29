import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@strapi/design-system/ModalLayout';
import { Button } from '@strapi/design-system/Button';
import { Field, FieldError, FieldInput, FieldLabel } from '@strapi/design-system/Field';
import { Stack } from '@strapi/design-system/Stack';
import { useIntl } from 'react-intl';
import { Typography } from '@strapi/design-system/Typography';
import useUpdateURI from '../../../hooks/useUpdateURI';
import useCheckAvailability from '../../../hooks/useCheckAvailability';
import useDebounce from '../../../hooks/useDebounce';
import { getCustomLink } from '../../../utils/api';
import { URI_REGEXP } from '../../../utils/regexp';

const EditModal = ({ id, kind, contentId, onClose }) => {
  const { formatMessage } = useIntl();
  const [hasError, setHasError] = useState(false);
  const { update: updateURI, isSaving } = useUpdateURI();
  const [uri, setURI] = useState('');
  const [savedURI, setSavedURI] = useState('');
  const { check: checkAvailability, available } = useCheckAvailability();
  const debouncedURI = useDebounce(uri, 300);
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await updateURI({
          uri,
          kind,
          contentId,
        });
        onClose();
        setSavedURI(uri);
      } catch (e) {
        setHasError(true);
      }
    },
    [contentId, kind, onClose, updateURI, uri]
  );

  useEffect(() => {
    if (debouncedURI && debouncedURI !== savedURI && !hasError) {
      checkAvailability({
        uri: debouncedURI,
        kind,
        contentId,
      });
    }
  }, [checkAvailability, contentId, debouncedURI, hasError, kind, savedURI]);

  useEffect(() => {
    const fetchURI = async () => {
      const {
        attributes: { uri },
      } = await getCustomLink(id);

      if (uri) {
        setURI(uri);
        setSavedURI(uri);
      }
    };
    fetchURI();
  }, [kind, contentId, id]);

  const getErrorWarning = () => {
    if (hasError) {
      return formatMessage({ id: 'custom-links.components.edit.inputs.uri.error' });
    }
    if (available.uri && !available.isAvailable) {
      return formatMessage({ id: 'custom-links.components.edit.inputs.uri.notAvailable' });
    }

    return '';
  };

  const handleChange = e => {
    setURI(e.target.value);
    setHasError(!URI_REGEXP.test(e.target.value));
  };

  return (
    <ModalLayout onClose={() => onClose()} as="form" onSubmit={handleSubmit} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {formatMessage({ id: 'custom-links.components.list.modal.edit.title' })}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Field
          name="uri"
          hint={formatMessage({ id: 'custom-links.components.edit.inputs.uri.hint' })}
          error={getErrorWarning()}
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
            {hasError ||
              (available.uri && available.uri !== '' && !available.isAvailable && <FieldError />)}
          </Stack>
        </Field>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={() => onClose()} variant="tertiary">
            {formatMessage({ id: 'custom-links.components.edit.button.cancel' })}
          </Button>
        }
        endActions={
          <Button
            variant="secondary"
            disabled={
              hasError || uri === '' || isSaving || savedURI === uri || !available.isAvailable
            }
            type="submit"
          >
            {formatMessage({ id: 'custom-links.components.edit.button.save' })}
          </Button>
        }
      />
    </ModalLayout>
  );
};
EditModal.defaultProps = {
  contentId: null,
};

EditModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  kind: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  contentId: PropTypes.string,
};

export default EditModal;
