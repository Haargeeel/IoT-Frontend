
module.exports = me = {};

me.init = function(req, res, next) {

  var q = 'friss_edited_queue';

  // Consumer
  function consumer(conn) {
    var ok = conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err != null) bail(err);
      ch.assertQueue(q, {durable: false});
      ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          //ch.ack(msg);
        }
      });
    }
  }

  require('amqplib/callback_api')
  .connect('amqp://192.168.99.100', function(err, conn) {
    if (err != null) bail(err);
    consumer(conn);
  });

  next();
};
