import { useAtomValue } from 'jotai'
import { workspacePermissionKeysAtom } from '@/context/permission-state'
import { hasPermission } from '@/utils/permission'

const SkillPermission = {
  View: 'skill.view',
  Edit: 'skill.edit',
  Publish: 'skill.publish',
  Delete: 'skill.delete',
} as const

export function useSkillPermissions() {
  const permissionKeys = useAtomValue(workspacePermissionKeysAtom)

  return {
    canView: hasPermission(permissionKeys, SkillPermission.View),
    canEdit: hasPermission(permissionKeys, SkillPermission.Edit),
    canPublish: hasPermission(permissionKeys, SkillPermission.Publish),
    canDelete: hasPermission(permissionKeys, SkillPermission.Delete),
  }
}
