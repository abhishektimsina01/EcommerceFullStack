import type { EsewaPayload } from '../types'

export function submitEsewaForm(payload: EsewaPayload) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = payload.action
  Object.entries(payload.fields).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = String(value)
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}
