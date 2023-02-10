import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

export default boot(({ app }) => {
  const notifyPositive = Notify.registerType('notifyPositive', {
    timeout: 0,
    group: false,
    position: 'bottom-right',
    icon: 'mdi-check',
    // icon: 'check_circle',
    iconSize: '30px',
    iconColor: 'green-13',
    textColor: 'white',
    classes: 'myNotify nPositive q-mb-lg'
  })
  const notifyWarning = Notify.registerType('notifyWarning', {
    timeout: 0,
    group: false,
    position: 'bottom-right',
    icon: 'mdi-alert-outline',
    // icon: 'check_circle',
    iconSize: '30px',
    iconColor: 'yellow-10',
    textColor: 'white',
    classes: 'myNotify nWarning q-mb-lg'
  })
  const notifyNegative = Notify.registerType('notifyNegative', {
    timeout: 0,
    group: false,
    position: 'bottom-right',
    icon: 'mdi-alert-outline',
    // icon: 'check_circle',
    iconSize: '30px',
    iconColor: 'deep-orange-14',
    textColor: 'white',
    classes: 'myNotify nNegative q-mb-lg'
  })
  app.use(
    notifyPositive,
    notifyWarning,
    notifyNegative
  )
})
