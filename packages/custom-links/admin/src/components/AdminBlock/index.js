import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useParams } from 'react-router-dom';
import ComponentWrapper from './ComponentWrapper';
import { getCustomLinkConfigContentType } from '../../utils/api';
import AdminEdit from '../AdminEdit';
import AdminEnable from '../AdminEnable';

const AdminBlock = () => {
  const { layout } = useCMEditViewDataManager();
  const params = useParams();
  const id = get(params, 'id', null);
  const kind = layout.uid;
  const [componentType, setComponentType] = useState('none');
  useEffect(() => {
    const fetchKind = async kind => {
      const data = await getCustomLinkConfigContentType({ contentType: kind });
      setComponentType(data.contentTypes.length > 0 ? 'Edit' : 'none');

      return data;
    };
    fetchKind(kind);
  }, [kind]);

  const renderComponent = () => {
    if (componentType === 'Edit') {
      return (
        <ComponentWrapper>
          <AdminEdit kind={kind} contentId={id} />
        </ComponentWrapper>
      );
    }

    return <AdminEnable />;
  };

  return renderComponent();
};

export default AdminBlock;
