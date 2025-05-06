
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Flag, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CourseForumProps {
  courseId: string;
}

const CourseForum = ({ courseId }: CourseForumProps) => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");

  // Mock forum posts for display purposes
  const forumPosts = [
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=68",
        role: "Student"
      },
      content: "I'm stuck on module 3. Can someone explain the concept of hooks in React?",
      date: "2 days ago",
      likes: 5,
      replies: 2
    },
    {
      id: "2",
      user: {
        name: "Maria Garcia",
        avatar: "https://i.pravatar.cc/150?img=47",
        role: "Teaching Assistant"
      },
      content: "In module 3, hooks are functions that allow you to 'hook into' React state and lifecycle features from function components. They don't work inside classes. The most common ones are useState and useEffect.",
      date: "1 day ago",
      likes: 12,
      replies: 1
    },
    {
      id: "3",
      user: {
        name: "David Kim",
        avatar: "https://i.pravatar.cc/150?img=51",
        role: "Student"
      },
      content: "Thank you Maria! That explanation really helped. I was confused about when to use useEffect vs useState.",
      date: "23 hours ago",
      likes: 3,
      replies: 0
    }
  ];

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    console.log("Submitting post:", newPost, "for course:", courseId);
    // Here you would normally submit the post to your backend
    setNewPost("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Course Discussion Forum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Textarea
              placeholder="Share your thoughts or ask a question..."
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                <Send className="h-4 w-4 mr-2" /> Post
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            {forumPosts.map((post) => (
              <div key={post.id} className="border-b pb-5 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{post.user.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">{post.user.role}</span>
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{post.content}</p>
                    <div className="flex gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" /> {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" /> Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground ml-auto">
                        <Flag className="h-3 w-3 mr-1" /> Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseForum;
