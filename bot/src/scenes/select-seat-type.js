import WizardScene from 'telegraf/scenes/wizard/index.js'
import Markup from 'telegraf/markup.js'
import messages from '../assets/messages/index.js'

const selectSeatType = new WizardScene(
  'selectSeatType',
  async ctx => {
    ctx.session.ticketTypes = ctx.session.ticketTypes || []

    if (ctx.callbackQuery && ctx.callbackQuery.data === 'NEXT') {
      if (!ctx.session.ticketTypes || ctx.session.ticketTypes.length === 0) {
        await ctx.reply(messages[ctx.session.language].selectAtLeastOneSeatType)
      } else {
        await ctx.scene.enter('enterNumberOfTickets')
      }
    } else {
      if (!ctx.callbackQuery || !ctx.callbackQuery.data) {
        ctx.session.ticketTypes = []
      }
      if (
        ctx.callbackQuery &&
            ctx.callbackQuery.data &&
            ctx.callbackQuery.data !== 'REMIND_ME_WHEN_AVAILABLE'
      ) {
        const seatTypeIndex = ctx.session.ticketTypes.indexOf(
          ctx.callbackQuery.data
        )

        if (seatTypeIndex > -1) {
          ctx.session.ticketTypes.splice(seatTypeIndex, 1)
        } else {
          ctx.session.ticketTypes.push(ctx.callbackQuery.data)
        }
      }

      const buttonList = Markup.inlineKeyboard([[
        Markup.callbackButton(
          `${messages[ctx.session.language].compartment} ${ctx.session.ticketTypes.indexOf('COMPARTMENT') > -1 ? '✅' : ''}`,
          'COMPARTMENT'
        ),
        Markup.callbackButton(
          `${messages[ctx.session.language].berth} ${ctx.session.ticketTypes.indexOf('BERTH') > -1 ? '✅' : ''}`,
          'BERTH'
        ),
        Markup.callbackButton(
          `${messages[ctx.session.language].deLuxe} ${ctx.session.ticketTypes.indexOf('DE_LUXE') > -1 ? '✅' : ''}`,
          'DE_LUXE'
        ),
      ], [
        Markup.callbackButton(
          `${messages[ctx.session.language].seating1stClass} ${ctx.session.ticketTypes.indexOf('SEATING_1ST_CLASS') > -1 ? '✅': ''}`,
          'SEATING_1ST_CLASS'
        ),
      ], [
        Markup.callbackButton(
          `${messages[ctx.session.language].seating2ndClass} ${ctx.session.ticketTypes.indexOf('SEATING_2ND_CLASS') > -1 ? '✅' : ''}`,
          'SEATING_2ND_CLASS'
        ),
      ], [
        Markup.callbackButton(
          `${messages[ctx.session.language].seating3dClass} ${ctx.session.ticketTypes.indexOf('SEATING_3D_CLASS') > -1 ? '✅' : ''}`,
          'SEATING_3D_CLASS'
        ),
      ], [
        Markup.callbackButton(messages[ctx.session.language].next, 'NEXT')
      ]]).extra()

      if (ctx.callbackQuery.data === 'REMIND_ME_WHEN_AVAILABLE') {
        await ctx.reply(messages[ctx.session.language].selectWagonType, buttonList)
      } else {
        await ctx.editMessageText(messages[ctx.session.language].selectWagonType, buttonList)
      }
    }
  }
)

export default selectSeatType
