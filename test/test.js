var safedown = require('../')(require('leveldown'))
var tape   = require('tape')
var testCommon = require('abstract-leveldown/testCommon')
var testBuffer = new Buffer('hello')

require('abstract-leveldown/abstract/leveldown-test').args(safedown, tape)
require('abstract-leveldown/abstract/open-test').args(safedown, tape, testCommon)
require('abstract-leveldown/abstract/del-test').all(safedown, tape, testCommon)
require('abstract-leveldown/abstract/put-test').all(safedown, tape, testCommon)
require('abstract-leveldown/abstract/get-test').all(safedown, tape, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').all(safedown, tape, testCommon, testBuffer)
require('abstract-leveldown/abstract/close-test').close(safedown, tape, testCommon)
require('abstract-leveldown/abstract/iterator-test').all(safedown, tape, testCommon)

require('abstract-leveldown/abstract/chained-batch-test').all(safedown, tape, testCommon)
require('abstract-leveldown/abstract/approximate-size-test').setUp(safedown, tape, testCommon)
require('abstract-leveldown/abstract/approximate-size-test').args(safedown, tape, testCommon)

require('abstract-leveldown/abstract/ranges-test').all(safedown, tape, testCommon)
require('abstract-leveldown/abstract/batch-test').all(safedown, tape, testCommon)

require('./custom-tests.js').all(safedown, tape, testCommon);
