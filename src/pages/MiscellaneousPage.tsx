
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, AlertCircle, BookOpen, ExternalLink, FileCode } from "lucide-react";

const MiscellaneousPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Miscellaneous Resources</h1>
          <p className="text-muted-foreground">Additional tools and resources to enhance your learning experience</p>
        </div>

        <Tabs defaultValue="resources" className="w-full mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="resources" className="hover-scale">Resources</TabsTrigger>
            <TabsTrigger value="documentation" className="hover-scale">Documentation</TabsTrigger>
            <TabsTrigger value="tools" className="hover-scale">Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-6">
            <Alert className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary font-medium">Resource Collection</AlertTitle>
              <AlertDescription>
                Find additional materials to support your learning journey. Browse through e-books, templates, and more.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Resource 1 */}
              <Card className="overflow-hidden card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Bread Recipe E-Book
                  </CardTitle>
                  <CardDescription>A comprehensive guide to artisanal bread making</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">PDF</Badge>
                    <Badge variant="outline">7.2 MB</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">This e-book contains over 50 recipes for various types of bread, with step-by-step instructions and images.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full button-3d">
                    <Download className="h-4 w-4 mr-2" /> Download E-Book
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Resource 2 */}
              <Card className="overflow-hidden card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Decorating Templates
                  </CardTitle>
                  <CardDescription>Cake decorating stencils and templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">ZIP</Badge>
                    <Badge variant="outline">12.5 MB</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">A collection of printable templates, stencils, and patterns for cake decorating and pastry work.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full button-3d">
                    <Download className="h-4 w-4 mr-2" /> Download Templates
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Resource 3 */}
              <Card className="overflow-hidden card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    Conversion Calculator
                  </CardTitle>
                  <CardDescription>Interactive measurement converter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Tool</Badge>
                    <Badge variant="outline">Online</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Convert between different measurement units commonly used in baking and cooking recipes.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full button-3d">
                    <ExternalLink className="h-4 w-4 mr-2" /> Open Calculator
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Integration guides for developers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Access technical documentation for integrating with our platform APIs.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-3d">View Documentation</Button>
                </CardFooter>
              </Card>
              
              <Card className="card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle>Learning Guides</CardTitle>
                  <CardDescription>Step-by-step tutorials</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Comprehensive guides to help you make the most of our platform features.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-3d">Browse Guides</Button>
                </CardFooter>
              </Card>
              
              <Card className="card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                  <CardDescription>Frequently asked questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Get answers to common questions about our platform and courses.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-3d">Read FAQ</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Card className="card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle>Recipe Calculator</CardTitle>
                  <CardDescription>Scale recipes up or down</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Easily adjust ingredient quantities for different serving sizes.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full button-3d">Launch Tool</Button>
                </CardFooter>
              </Card>
              
              <Card className="card-3d hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle>Substitution Guide</CardTitle>
                  <CardDescription>Find ingredient alternatives</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Comprehensive guide for ingredient substitutions in recipes.</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full button-3d">Open Guide</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Latest Updates</h2>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">May 4, 2025</p>
                <h4 className="font-medium mb-1">New Resource Collection Released</h4>
                <p className="text-sm text-muted-foreground">We've added 25 new templates and guides to our resource collection.</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">April 28, 2025</p>
                <h4 className="font-medium mb-1">Documentation Updates</h4>
                <p className="text-sm text-muted-foreground">Our API documentation has been updated with new endpoints and examples.</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">April 15, 2025</p>
                <h4 className="font-medium mb-1">Recipe Calculator Improvement</h4>
                <p className="text-sm text-muted-foreground">Added support for metric and imperial unit conversions in the recipe calculator.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MiscellaneousPage;
