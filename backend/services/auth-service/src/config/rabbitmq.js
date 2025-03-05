const amqp = require('amqplib');
const { config } = require('./index');
const { logger } = require('../utils/logger');

let connection;
let channel;

const setupRabbitMQ = async () => {
  try {
    // Connect to RabbitMQ
    connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();

    // Setup exchange
    await channel.assertExchange(config.rabbitmq.exchange, 'topic', { durable: true });

    // Setup queue
    await channel.assertQueue(config.rabbitmq.queue, { durable: true });

    // Bind queue to exchange
    await channel.bindQueue(config.rabbitmq.queue, config.rabbitmq.exchange, '#');

    // Handle connection close
    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
      setTimeout(setupRabbitMQ, 5000);
    });

    // Handle errors
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      setTimeout(setupRabbitMQ, 5000);
    });

    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    setTimeout(setupRabbitMQ, 5000);
  }
};

const publishMessage = async (routingKey, message) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const success = channel.publish(
      config.rabbitmq.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    return success;
  } catch (error) {
    logger.error('Failed to publish message to RabbitMQ:', error);
    return false;
  }
};

const consumeMessages = async (routingKey, callback) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    // Create a specific queue for this consumer
    const { queue } = await channel.assertQueue('', { exclusive: true });
    
    // Bind to the exchange with the routing key
    await channel.bindQueue(queue, config.rabbitmq.exchange, routingKey);

    // Consume messages
    await channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing RabbitMQ message:', error);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    logger.error('Failed to consume messages from RabbitMQ:', error);
    throw error;
  }
};

module.exports = { setupRabbitMQ, publishMessage, consumeMessages }; 