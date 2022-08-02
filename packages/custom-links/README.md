<p align="center">
  <img src="https://user-images.githubusercontent.com/505236/181904982-37d3ad4c-d430-4a21-911b-08e8b9e8fdf7.png" width="318px" alt="Strapi logo" />
</p>

<div align="center">
  <h1>Strapi v4 - Custom Links</h1>
</div>

A plugin for [Strapi](https://github.com/strapi/strapi) that allows you to create and edit URI for different ContentTypes.

## Installation

```sh
npm install strapi-plugin-custom-links
```

**or**

```sh
yarn add strapi-plugin-custom-links
```

## Configuration

You can configure the plugin directly from the Strapi interface in developer mode.

Go to **Settings > Custom-Links Plugin > Configuration**

And add content-types you wish to associate Custom-Links and just save it.

![plugin settings](https://user-images.githubusercontent.com/505236/181905076-bcbaca58-ec4d-4d5c-ad0d-84f14329bd9e.png)

**_NOTE_**

Alternatively, you can create the config file by your own, by creating a file `custom-links.js` inside the folder config of your strapi project.

The file looks like this :

`./config/custom-links.js`

```javascript
'use strict';

module.exports = {
  contentTypes: ['api::mycontenttype.mycontenttype', 'api::othercontentype.othercontentype'],
};
```

## Create and edit Custom-Links

### From the Content Manager

When editing a Content-Type, you will find at the right section a Custom-Link block, in wich you can create or update a Custom-Link by editing the URI field.

![plugin editing](https://user-images.githubusercontent.com/505236/181905044-cdeb3dda-324c-4c44-b73c-35a3dbba0fd4.png)

### From the Custom-Links plugin section

You will be able to retrieve the list of Custom-Links from **Plugins > Custom-Links** section.

In this section you can search, filter, update or delete Custom-Links.

![admin-custom-links](https://user-images.githubusercontent.com/505236/181905098-c4aac507-8454-41f3-9ed2-69d2988482fa.png)

## API Usage

### Basic Usage

#### Note on proxy pattern

Our own use of this plugin is to only rely on the URI to request every content-type (the same way you would request a node with Drupal 8) then dynamically create a template according to the nature of the data returned. This is a pattern called **proxy**.

Since this plugin can be enabled only on a few content-types, we reckon that you might need to fetch the custom-link collection itself.

#### Endpoint of a content-type retrieve by its Custom-Links uri

As we always try to stay as close as possible of the strapi default behavior and core concept while developing this plugin, we think that per URI request shouldn't be used with a `GET` parameters because they prevent the request to be cached by the browser and are harder to manage behind a CDN.

| Method | URL                            | Description                                         | Details                                          |
| ------ | ------------------------------ | --------------------------------------------------- | ------------------------------------------------ |
| `GET`  | `/api/custom-links/proxy/:uri` | Fetch the data of a Content-Type by its Custom-Link | By default components and relations are populate |

#### Example response of a proxy request (/api/custom-links/proxy/my-article-uri):

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Mon article",
      "slug": "mon-article",
      "createdAt": "2022-08-01T16:32:35.878Z",
      "updatedAt": "2022-08-01T16:32:35.878Z",
      "component": [
        {
          "id": 1,
          "text": "A component"
        }
      ],
      "content": [
        {
          "__component": "core.component",
          "id": 2,
          "text": "A dyn component"
        }
      ]
    }
  },
  "meta": {
    "meta": {
      "customLink": {
        "uri": "/my-article-uri",
        "kind": "api::article.article",
        "contentId": "1"
      }
    }
  }
}
```

#### Custom-Link meta

As you can see on the previous example we inject customLink data inside the meta of the result.

Example of a request `/api/article/1`

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Mon article",
      "slug": "mon-article",
      "createdAt": "2022-08-01T16:32:35.878Z",
      "updatedAt": "2022-08-01T16:32:35.878Z",
      "publishedAt": null
    }
  },
  "meta": {
    "meta": {
      "customLink": {
        "uri": "/my-article-uri",
        "kind": "api::article.article",
        "contentId": "1"
      }
    }
  }
}
```

### Alternative Usage

You can also use the custom-link CRUD which exposes the same endpoints as the strapi default controller.

By requesting a Custom-Link collection, you can retrieve the kind (the Content-Type uid) and the contentId (the id of the ContentType) and then request the Content-Type associated.

#### Endpoints

| Method | URL                       | Description                   | Details                                       |
| ------ | ------------------------- | ----------------------------- | --------------------------------------------- |
| `GET`  | `/api/custom-links`       | Fetch custom links            | For more information see Strapi documentation |
| `POST` | `/api/custom-links`       | Create a custom-link          | -                                             |
| `GET`  | `/api/custom-links/:id`   | Fetch one custom-link         | -                                             |
| `GET`  | `/api/custom-links/count` | Get the count of custom-links | -                                             |
| `PUT`  | `/api/custom-links/:id`   | Update a custom-link          | -                                             |

### Custom-Link Schema

| Field     | Type         | Unique | minLength | regExp                | Description                           |
| --------- | ------------ | ------ | --------- | --------------------- | ------------------------------------- |
| id        | `biginteger` | true   | 1         |                       | The id of the Custom-Link             |
| uri       | `string`     | true   | 1         | `^/[a-zA-Z0-9-_./]*$` | The uri of the Custom-Link            |
| kind      | `string`     | false  | -         | -                     | The uid of the ContentType associated |
| contentId | `biginteger` | false  | -         | -                     | The id of the ContentType associated  |
