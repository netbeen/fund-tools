import moment from 'moment'
import MockDate from 'mockdate'
import dayjs from '../src'
import '../src/locale/ja'

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

it('Format no formatStr', () => {
  expect(dayjs().format()).toBe(moment().format())
})
