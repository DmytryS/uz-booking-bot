import WizardScene from 'telegraf/scenes/wizard/index.js'
import Markup from 'telegraf/markup.js'
import Extra from 'telegraf/extra.js'
import UzClient from 'uz-booking-client'
import messages from '../assets/messages/index.js'
import logger from '../lib/logger.js'

const sendErrorMessage = (ctx, message) =>
  ctx.reply(`${messages[ctx.session.language].errorOccured}\n${message || ''}`)

const selectDepartureStation = new WizardScene(
  'selectDepartureStation',
  async ctx => {
    await ctx.reply(messages[ctx.session.language].enterDepartureStation)

    return ctx.wizard.next()
  },
  async ctx => {
    let stations = []

    try {

      const uzClient = new UzClient.ApiV1(ctx.session.language)
      const response = await uzClient.Station.find(ctx.message.text)

      stations = response.data
    } catch (err) {
      logger.error('An error occured during departure station fetch', err)
      await sendErrorMessage(
        ctx,
        err.response && err.response.status === 503
          ? 'Service unavailable'
          : err.message
      )
      // ctx.reply(messages[ctx.session.language].enterDepartureStation);
      await ctx.scene.enter('initialScene')

      return
    }

    if (stations.length === 0) {
      await ctx.reply(messages[ctx.session.language].stationNotExists)
      await ctx.reply(messages[ctx.session.language].enterDepartureStation)

      return
    }
    ctx.session.stations = stations

    await ctx.reply(
      messages[ctx.session.language].choseStation,
      Extra.markup(
        Markup.keyboard(stations.map(station => station.title))
          .oneTime()
          .resize()
      )
    )

    await ctx.wizard.next()
  },
  async ctx => {
    const departureStation = ctx.session.stations.find(
      station => station.title === ctx.message.text
    )

    if (!departureStation) {
      await ctx.reply(messages[ctx.session.language].choseStation)

      return
    }

    ctx.session.departureStation = departureStation.value
    ctx.session.departureStationName = ctx.message.text

    delete ctx.session.stations

    await ctx.scene.enter('selectArrivalStation')
  }
)

export default selectDepartureStation
