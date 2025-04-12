import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export interface FeedPostAuthor {
  name: string;
  avatar?: string;
}

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  author: FeedPostAuthor;
  timestamp: string;
  tags: string[];
  likes: number;
  comments: number;
  courseId?: string | number; // Added courseId as an optional property
}

interface CourseFeedsProps {
  isPreview?: boolean;
}

const CourseFeeds = ({ isPreview = false }: CourseFeedsProps) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  
  const canCreatePosts = hasRole(["admin", "instructor"]);
  
  useEffect(() => {
    // In a real app, fetch from an API
    const mockPosts = [
      {
        id: "post1",
        title: "Introduction to React Hooks",
        content: "Today we'll be diving into React Hooks and how they can simplify your component logic. Make sure to check out the example repository to follow along!",
        author: {
          name: "Sarah Johnson",
          avatar: "",
        },
        timestamp: "2 hours ago",
        tags: ["react", "javascript", "frontend"],
        likes: 24,
        comments: 5
      },
      {
        id: "post2",
        title: "Understanding TypeScript Generics",
        content: "Generics are one of the most powerful features of TypeScript. In this post, we'll explore how to use them effectively in your applications.",
        author: {
          name: "Michael Chen", 
          avatar: "",
        },
        timestamp: "Yesterday",
        tags: ["typescript", "javascript", "programming"],
        likes: 42,
        comments: 8
      },
      {
        id: "post3",
        title: "CSS Grid vs Flexbox: When to Use Each",
        content: "A comparison of CSS Grid and Flexbox layout techniques with practical examples for different UI scenarios.",
        author: {
          name: "Emma Rodriguez",
          avatar: "", 
        },
        timestamp: "3 days ago",
        tags: ["css", "web-design", "frontend"],
        likes: 36,
        comments: 12
      }
    ];
    
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);
  
  // Display limited posts in preview mode
  const displayPosts = isPreview ? posts.slice(0, 2) : posts;
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Course Feeds</h2>
        </div>
        
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Course Feeds</h2>
          {canCreatePosts && (
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Create Post
            </Button>
          )}
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-3">No course feed posts available.</p>
            {canCreatePosts && (
              <Button variant="outline" className="mx-auto">
                <Plus className="h-4 w-4 mr-1" /> Create First Post
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold neon-text-primary">Course Feeds</h2>
        {canCreatePosts && (
          <Button variant="outline" size="sm" className="glow-effect flex items-center gap-1">
            <Plus className="h-4 w-4" /> Create Post
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {displayPosts.map((post) => (
          <Card key={post.id} className="course-card feed-post">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <div className="text-sm flex items-center space-x-2">
                        <span className="font-medium">{post.author.name}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">{post.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="hover:bg-primary/5 cursor-pointer transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-4 text-muted-foreground border-t pt-3">
                <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                  <Heart className="h-4 w-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors ml-auto">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {isPreview && posts.length > 2 && (
        <div className="text-center">
          <Button variant="outline" className="glow-effect">
            View All Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseFeeds;
