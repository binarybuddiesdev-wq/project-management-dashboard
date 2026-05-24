export interface IMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  department: string
  joinedAt: string
}

export interface IMemberFormData {
  name: string
  email: string
  role: string
  department: string
}

export interface IMemberCardProps {
  member: IMember
  onEdit?: (member: IMember) => void
  onDelete?: (id: string) => void
}

export interface IInviteMemberModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: IMemberFormData) => Promise<void>
  isLoading?: boolean
}
