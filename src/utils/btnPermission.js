export function btnPermission (permission) {
  const responsePermission = ['resource-create', 'resource-edit', 'resource-delete']

  return !responsePermission.includes(permission)
}
