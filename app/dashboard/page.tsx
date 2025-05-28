'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Clock, Film, Plus, Video, Wand2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Database } from "@/types/supabase"
import { SidebarTrigger } from "@/components/ui/sidebar"

type Video = Database['public']['Tables']['videos']['Row']

export default function DashboardPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setVideos(data || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [supabase])

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Create New Video
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-neutral-950 border-none shadow-md shadow-neutral-300 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
            <p className="text-xs text-muted-foreground">Videos created with our platform</p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-950 border-none shadow-md shadow-neutral-300 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.filter(video => video.status === 'processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Videos currently being processed</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
            <CardDescription>Your recently created videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <Video className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">No videos yet</p>
                <p className="text-xs text-muted-foreground">Create your first video to see it here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Your Videos</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden border-none shadow-md shadow-neutral-300">
              <div className="aspect-square bg-neutral-950 border-none">
                <video
                  src={video.video_url}
                  className="h-full w-full object-contain aspect-[3/4]"
                  controls
                />
              </div>
              <CardHeader className="bg-neutral-950 text-white h-full">
                <CardTitle className="text-lg">{video.title || 'Untitled Video'}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

