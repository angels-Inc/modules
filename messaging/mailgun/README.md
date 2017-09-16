# mailgun

Send emails with mailgun in your Graphcool project 🎁

## Getting Started

```sh
npm -g install graphcool
graphcool init
graphcool module add graphcool/modules/messaging/mailgun
```

## Configuration

After downloading the module, add it to the `modules` section in your `graphcool.yml` file:

```yaml
modules:
  mailgun: modules/mailgun/graphcool.yml
```

In your base project, you need to configure the following **environment variables**.

- `MAILGUN_API_KEY`: mailgun API Key
- `MAILGUN_DOMAIN`: mailgun domain

You can receive them after [signing up at mailgun](https://app.mailgun.com/app/dashboard).

An easy way to setup environment variables is using [direnv](https://direnv.net/).
To use `direnv`, put the following into `.envrc` in you project root:

```sh
export MAILGUN_API_KEY=xxx
export MAILGUN_DOMAIN=xxx
```

## Flow

### Single Emails

Whenever a new `MailgunEmail` node is created with information about the recipient, sender, subject and email body, the server-side subscription picks it up and invokes the Mailgun API to send out the email.

### Batched Email

WIP: You can also send [batched emails](http://mg-documentation.readthedocs.io/en/latest/user_manual.html#batch-sending) using the mailgun API.

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
  createMailgunEmail(
    from: "__YOUR_EMAIL__"
    to: "__YOUR_EMAIL__"
    subject: "A new email from the Graphcool mailgun module!"
    text: "This is your first email from the Graphcool mailgun module!"
  ) {
    id
  }
}
```

You should see that a new `MailgunEmail` node has been created, and you received a new email. This is also reflected in the function logs.

![](http://i.imgur.com/5RHR6Ku.png)
