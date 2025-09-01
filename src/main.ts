import * as core from '@actions/core'
import TelegramBot from 'node-telegram-bot-api'
import { env } from 'node:process'
import { glob } from 'glob'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('token', { required: true })
    const chatId = core.getInput('chat-id', { required: true })
    const message = core.getInput('body')
    const documentsInput = core.getInput('files') // Input with patterns
    const apiUrl = core.getInput('api-url')

    // Split the input string by newlines, trim whitespace, and filter empty lines
    const patterns = documentsInput
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    // Collect all matching files from patterns
    let documentPaths: string[] = []
    patterns.forEach(pattern => {
      // Use glob to match the files
      const matches = glob.sync(pattern)
      if (matches.length > 0) {
        documentPaths = documentPaths.concat(matches)
      } else {
        throw Error(`No files found for pattern: ${pattern}`) // Stop execution if no files found
      }
    })

    const file_count = documentPaths.length

    const bot = new TelegramBot(token, { polling: false, baseApiUrl: apiUrl })
    if (!bot) {
      throw Error('Failed to initialize Telegram bot.') 
    }

    // --- File sending logic with validation ---
    if (file_count > 0) {
      const media: any[] = []

      for (const filePath of documentPaths) {
        media.push({
          type: 'document',
          media: filePath
        })
      }

      const lastMedia = media[media.length - 1]
      lastMedia.caption = message

      env.NTBA_FIX_350 = 'true' // Enable MIME auto detect

      if (file_count === 1) {
        await bot.sendDocument(chatId, documentPaths[0], {
          caption: message
        });
      } else {
        await bot.sendMediaGroup(chatId, media)
      }
    }

    core.info('Successfully sent files to Telegram.')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unknown error occurred.')
    }
  }
}
