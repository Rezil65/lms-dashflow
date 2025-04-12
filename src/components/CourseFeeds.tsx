
import { useEffect, useState } from "react";
import { BookOpen, Plus, MessageCircle, ThumbsUp, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  tags: string[];
  likes: number;
  comments: number;
  courseId?: string;
  hasLiked?: boolean;
}

interface CourseFeedsProps {
  courseId?: string;
}

// Mock data
const mockFeeds: FeedPost[] = [
  {
    id: "feed1",
    title: "Introduction to React Hooks",
    content: "Today we'll be diving into React Hooks and how they can simplify your component logic. Make sure to check out the example repository to follow along!",
    author: {
      name: "Sarah Johnson",
      avatar: "",
    },
    timestamp: "2 hours ago",
    tags: ["react", "javascript", "frontend"],
    likes: 24,
    comments: 5,
    hasLiked: false
  },
  {
    id: "feed2",
    title: "Understanding TypeScript Generics",
    content: "Generics are one of the most powerful features of TypeScript. In this post, we'll explore how to use them effectively in your applications.",
    author: {
      name: "Michael Chen",
      avatar: "",
    },
    timestamp: "Yesterday",
    tags: ["typescript", "javascript", "programming"],
    likes: 42,
    comments: 8,
    hasLiked: true
  },
  {
    id: "feed3",
    title: "CSS Grid vs Flexbox: When to Use Each",
    content: "A comparison of CSS Grid and Flexbox layout techniques with practical examples for different UI scenarios.",
    author: {
      name: "Emma Rodriguez",
      avatar: "",
    },
    timestamp: "3 days ago",
    tags: ["css", "web-design", "frontend"],
    likes: 36,
    comments: 12,
    hasLiked: false
  }
];

const CourseFeeds = ({ courseId }: CourseFeedsProps) => {
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch feeds from an API based on courseId
    // Here we're just using mock data
    setFeeds(mockFeeds);
  }, [courseId]);

  const handleLike = (feedId: string) => {
    setFeeds(prevFeeds => prevFeeds.map(feed => {
      if (feed.id === feedId) {
        const newLikeStatus = !feed.hasLiked;
        return {
          ...feed,
          likes: newLikeStatus ? feed.likes + 1 : feed.likes - 1,
          hasLiked: newLikeStatus
        };
      }
      return feed;
    }));
  };

  const handleComment = (feedId: string) => {
    toast({
      title: "Comments",
      description: "Comment feature will be implemented soon!"
    });
  };

  const handleShare = (feedId: string) => {
    toast({
      title: "Shared!",
      description: "Post has been shared to your profile."
    });
  };

  const handleReport = (feedId: string) => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Feeds</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {feeds.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No feeds available</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a post in this course feed!
            </p>
            <Button>Create New Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feeds.map(feed => (
            <Card key={feed.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      {feed.author.avatar ? (
                        <img src={feed.author.avatar} alt={feed.author.name} />
                      ) : (
                        <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center text-white font-medium">
                          {feed.author.name.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{feed.title}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground mt-1 space-y-1 sm:space-y-0">
                        <span>{feed.author.name}</span>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>{feed.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="mb-4">{feed.content}</p>
                <div className="flex flex-wrap gap-2">
                  {feed.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="hover:bg-secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full">
                  <Button 
                    variant={feed.hasLiked ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => handleLike(feed.id)}
                    className="text-muted-foreground"
                  >
                    <ThumbsUp className={`h-4 w-4 mr-2 ${feed.hasLiked ? 'fill-current' : ''}`} />
                    {feed.likes}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleComment(feed.id)}
                    className="text-muted-foreground"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {feed.comments}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShare(feed.id)}
                    className="text-muted-foreground"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleReport(feed.id)}
                    className="text-muted-foreground"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseFeeds;
