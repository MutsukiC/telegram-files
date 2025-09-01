# Telegram File Action

This GitHub Action allows you to upload files from your GitHub repository to
Telegram. Perfect for sharing build artifacts, logs, or any files directly
through Telegram messages.

## Inputs

### `chat-id`

**Required** The recipient chat's ID.

### `body`

**Optional** The message to send along with the files.

### `files`

**Required** The list of file paths to upload, one file per line.

### `api-url`

**Optional** Custom API URL to use.

## Outputs

None

## Example usage

This example demonstrates how to use the Telegram File Uploader action with the
required inputs and environment variables.

Create a `.github/workflows/telegram-upload.yml` (or add to your existing
workflow file):

```yaml
name: Upload Files to Telegram

on: [push]

jobs:
  upload-to-telegram:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Upload files to Telegram
      uses: RyogiMutsuki/telegram-files
      with:
        chat-id: 'chat_id'
        body: 'Here are your files!'
        files: |
        /path/to/file1
        /path/to/file2
        /path/to/*
      with:
        token: ${{ secrets.BOT_TOKEN }}
```

Make sure the actual values of `chat-id` and `files` inputs. Also, remember to
set `token` in your repository's secrets.

```yaml
with:
  token: ${{ secrets.BOT_TOKEN }}
```

---

This README provides a basic overview of your GitHub Action, how to use it, and
how to configure it with necessary environment variables. Adjust the content
according to your actual action's repository, inputs, and needs.
