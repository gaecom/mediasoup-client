const bowser = require('bowser');
const Logger = require('./Logger');
const Chrome75 = require('./handlers/Chrome75');
const Chrome70 = require('./handlers/Chrome70');
const Chrome67 = require('./handlers/Chrome67');
const Chrome55 = require('./handlers/Chrome55');
const Safari12 = require('./handlers/Safari12');
const Safari11 = require('./handlers/Safari11');
const Firefox60 = require('./handlers/Firefox60');
const Edge11 = require('./handlers/Edge11');
const ReactNative = require('./handlers/ReactNative');

const logger = new Logger('detectDevice');

module.exports = function()
{
	// React-Native.
	if (typeof navigator === 'object' && navigator.product === 'ReactNative')
	{
		if (typeof RTCPeerConnection !== 'undefined')
		{
			return ReactNative;
		}
		else
		{
			logger.warn('unsupported ReactNative without RTCPeerConnection');

			return null;
		}
	}
	// browser.
	else if (typeof navigator === 'object' && typeof navigator.userAgent === 'string')
	{
		const ua = navigator.userAgent;
		const browser = bowser.getParser(ua);
		const engine = browser.getEngine();

		// Chrome and Chromium (desktop and mobile).
		if (browser.satisfies({ chrome: '>=75', chromium: '>=75' }))
		{
			return Chrome75;
		}
		else if (browser.satisfies({ chrome: '>=70', chromium: '>=70' }))
		{
			return Chrome70;
		}
		else if (browser.satisfies({ chrome: '>=67', chromium: '>=67' }))
		{
			return Chrome67;
		}
		else if (browser.satisfies({ chrome: '>=55', chromium: '>=55' }))
		{
			return Chrome55;
		}
		// Opera (desktop and mobile).
		else if (browser.satisfies({ opera: '>=57' }))
		{
			return Chrome70;
		}
		else if (browser.satisfies({ opera: '>=44' }))
		{
			return Chrome55;
		}
		// Firefox (desktop and mobile).
		else if (browser.satisfies({ firefox: '>=60' }))
		{
			return Firefox60;
		}
		// Safari (desktop and mobile).
		else if (browser.satisfies({ safari: '>=12.1' }))
		{
			return Safari12;
		}
		else if (browser.satisfies({ safari: '>=11' }))
		{
			return Safari11;
		}
		// Edge (desktop).
		else if (browser.satisfies({ 'microsoft edge': '>=11' }))
		{
			return Edge11;
		}
		// Best effort for Chromium based browsers.
		else if (engine.name.toLowerCase() === 'blink')
		{
			logger.debug('best effort Chromium based browser detection');

			const match = ua.match(/(?:(?:Chrome|Chromium))[ /](\w+)/i);

			if (match)
			{
				const version = Number(match[1]);

				if (version >= 75)
					return Chrome75;
				else if (version >= 70)
					return Chrome70;
				else if (version >= 67)
					return Chrome67;
				else
					return Chrome55;
			}
			else
			{
				return Chrome75;
			}
		}
		// Unsupported browser.
		else
		{
			logger.warn(
				'browser not supported [name:%s, version:%s]',
				browser.getBrowserName(), browser.getBrowserVersion());

			return null;
		}
	}
	// Unknown device.
	else
	{
		logger.warn('unknown device');

		return null;
	}
};
