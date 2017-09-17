# algolia

Add automatic Algolia indexing to your Graphcool project ⚡️

## Getting Started

```sh
npm -g install graphcool
graphcool init
graphcool module add graphcool/modules/syncing/algolia
```

## Configuration

In your base project, you need to configure the following **environment variables**.

- `ALGOLIA_APPLICATION_ID`: Algolia Application ID
- `ALGOLIA_API_KEY`: Algolia API Key
- `ALGOLIA_INDEX_NAME`: Algolia Index Name

An easy way to set these up is using [direnv](https://direnv.net/).
To use `direnv`, put the following into `.envrc` in you project root:

```sh
export ALGOLIA_APPLICATION_ID=xxx
export ALGOLIA_API_KEY=xxx
export ALGOLIA_INDEX_NAME=xxx
```

Read on to see how to obtain the environment variables.

## Set up your Sync Query

To enable this module you need to make changes to two files:

 - `code/syncQuery.graphql`
 - `code/sync.js`

 ### syncQuery.graphql

 This module comes with a `SyncQuery` model out of the box, so you can start experimenting with syncing without affecting your existing models.

 When you are ready to enable syncing of an existing model, simply change the `syncQuery.graphql` file accordingly.

 ```graphql
subscription {
  SyncModel(filter: {
    mutation_in: [CREATED, UPDATED, DELETED]
  }) {
    mutation
    previousValues {
      objectID: id
    }
    node {
      objectID: id
      name
      points
    }
  }
}
 ```

By default, both create, update and delete mutations are synced to Algolia. If you don't want to delete objects in the Algolia index, simply remove `DELETED` from the filter in your mutation query.

There are 3 fields in the mutation query payload above:

*mutation* is used to decide the correct syncing action - create, update or delete

*previousValues* is used to delete objects from the index. the `id` field has to be mapped to `objectID` to work.

*node* is the actual object you want to sync to the Algolia index. It is recommended that you map the `id` field to `objectID` as otherwise, Algolia will generate a random `objectID` for you, making it difficult to update and delete the object later.

### sync.js

At the top of the file there are four placeholder values you need to replace:

```js
var client = algoliasearch('YourApplicationID', 'YourAPIKey');
var index = client.initIndex('yourIndexName');
const modelName = 'yourModelName'
```

You get the Application Id and API Key from the api Keys section in your Algolia console. Be aware that you can not  use the Admin API Key to sync objects. Instead you have to create a new API Key and give it access to the `addObject` and `deleteObject` operations.

Indexes are automatically created for you in Algolia, so just specify a name here.

modelName has to be the name of the model you want to sync.

## Try it

Try to create a node for the model you configured. You should see a `Adding node` message in your function log, and the new node should show up in your Algolia index.

If there is an error, you can see the debug message in your function log.

![](http://i.imgur.com/5RHR6Ku.png)
