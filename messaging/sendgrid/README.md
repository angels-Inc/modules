# sendgrid

Send emails with SendGrid in your Graphcool project 🎁

## Getting Started

```sh
npm -g install graphcool
graphcool init
graphcool module add graphcool/modules/messaging/sendgrid
```

## Configuration

After downloading the module, add it to the `modules` section in your `graphcool.yml` file:

```yaml
modules:
  sendgrid: modules/sendgrid/graphcool.yml
```

In your base project, you need to configure the following **environment variables**.

- `SENDGRID_API_KEY`: SendGrid API Key

An easy way to set these up is using [direnv](https://direnv.net/).
To use `direnv`, put the following into `.envrc` in you project root:

```sh
export SENDGRID_API_KEY=xxx
```

You can create a new Sendgrid API Key [in the account settings](https://app.sendgrid.com/settings/api_keys) after signing up.

## Flow

Whenever a new `Email` node is created with information about the recipient, sender, subject and email body, the server-side subscription picks it up and invokes the SendGrid API to send out the email.

## Test the Code

Go to the Graphcool Playground:

```sh
graphcool playground
```

Hook into the function logs:

```sh
graphcool logs -f sendEmail --tail
```

Run this mutation to create a new email:

```graphql
mutation {
  # replace __YOUR_EMAIL__!
  createEmail(
    content: "This is your first email from the Graphcool SendGrid module!"
    fromEmail: "nilan@graph.cool"
    toEmail: "__YOUR_EMAIL__"
    subject: "A new email from the Graphcool SendGrid module!"
  ) {
    id
  }
}
```

You should see that a new `Email` node has been created, and you received a new email. This should also be refleted by the function logs.

![](http://i.imgur.com/5RHR6Ku.png)
