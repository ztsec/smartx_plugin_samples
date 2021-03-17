import sys
import json
import time
import kungfu.yijinjing.time as kft
from kungfu.wingchun.constants import *

account = "fundid"
source = Source.XTP
exchange = Exchange.SSE

def test_timer(context, event):
    context.log.info('test timer')

def test_time_interval(context, event):
    context.log.info('test time interval')

def pre_start(context):
    context.log.info("pre run strategy")
    context.add_account(source, account, 100000000.0)
    context.subscribe(source, ["600000", "601988"], exchange)
    context.count = 1

def on_quote(context, quote):
    context.logger.info("exexute[on_quote]position: {}".format(context.book.get_position(quote.instrument_id, exchange)))
    if (quote.instrument_id == "600000" or  quote.instrument_id == "601988") and context.count > 0:
        order_id = context.insert_order(quote.instrument_id, exchange, account, quote.ask_price[0], 600, PriceType.Limit, Side.Buy, Offset.Open)
        context.count = context.count - 1
    context.log.info("quote received: [time]{} [instrument_id]{} [last_price]{}".format(kft.strftime(quote.data_time), quote.instrument_id, quote.last_price))

def on_transaction(context, transaction):
    context.log.info("{} {}".format(transaction.instrument_id, transaction.exchange_id))
    pass

def on_entrust(context, entrust):
    context.log.info("{} {}".format(entrust.instrument_id, entrust.exchange_id))
    pass

def on_order(context, order):
    context.log.info('order received: [instrument_id]{} [volume]{} [price]{}'.format(order.instrument_id, order.volume, order.limit_price))

def on_trade(context, trade):
    context.log.info('trade received: {} [trade_id]{} [volume]{} [price]{}'.format(kft.strftime(trade.trade_time), trade.order_id, trade.volume, trade.price))

def on_client_msg(context, msg):
    context.log.warn("strategy received on_client_msg msg:{}".format(msg))
    parameters = json.loads(msg)
    ret_msg = {'request': parameters["msg"], 'response':time.time()}
    context.send_msg(json.dumps(ret_msg))
