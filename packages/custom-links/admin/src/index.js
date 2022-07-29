import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import pluginIcon from './components/PluginIcon';
import Initializer from './components/Initializer';
import AdminBlock from './components/AdminBlock';
import { getTrad } from './translations';
import pluginPermissions from './permissions';

const { name } = pluginPkg.strapi;
const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

export default {
  register(app) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: pluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Custom-Links',
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "custom-links-edit-page" */ './pages/EditPage'
        );

        return component;
      },
      permissions: pluginPermissions.main,
    });

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad('pages.settings.section.title'),
          defaultMessage: 'Custom-Links Plugin',
        },
      },
      [
        {
          intlLabel: {
            id: getTrad('pages.settings.section.subtitle'),
            defaultMessage: 'Configuration',
          },
          id: name,
          to: `/settings/${pluginId}`,
          async Component() {
            const component = await import(
              /* webpackChunkName: "custom-links-settings-page" */ './pages/SettingsPage'
            );

            return component;
          },
          permissions: pluginPermissions.settings,
        },
      ]
    );
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'AdminBlock',
      Component: AdminBlock,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale =>
        import(`./translations/${locale}.json`)
          .then(({ default: data }) => ({
            data: prefixPluginTranslations(data, pluginId),
            locale,
          }))
          .catch(() => ({
            data: {},
            locale,
          }))
      )
    );

    return Promise.resolve(importedTrads);
  },
};
