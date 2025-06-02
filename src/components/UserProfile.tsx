import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')

  async function updateProfile() {
    try {
      setLoading(true)
      // هنا يمكنك إضافة منطق تحديث الملف الشخصي الخاص بك
      // مثال: await updateUserProfile({ username, website })
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error updating profile!',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback>{username?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="text"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="website">Website</label>
            <Input
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-between">
            <Button
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOut()}
              disabled={loading}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 