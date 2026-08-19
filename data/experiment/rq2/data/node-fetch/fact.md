Major: require('node-fetch/lib/response') etc. is now unsupported; use require('node-fetch').Response or ES6 module imports

Major: response.text() no longer attempts to detect encoding, instead always opting for UTF-8 (per spec); use response.textConverted() for the v1 behavior

Major: remove headers.getAll(); make get() return all headers delimited by commas (per spec)