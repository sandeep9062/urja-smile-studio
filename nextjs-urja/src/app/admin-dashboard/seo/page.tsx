"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, FileText, Globe, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockSEOScores } from "@/lib/mock-data";

export default function SEOManagerPage() {
  const [seoScores] = useState(mockSEOScores);
  const [sitemap, setSitemap] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://urjadental.com/</loc><priority>1.0</priority></url>
  <url><loc>https://urjadental.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://urjadental.com/services</loc><priority>0.9</priority></url>
  <url><loc>https://urjadental.com/doctors</loc><priority>0.8</priority></url>
  <url><loc>https://urjadental.com/blog</loc><priority>0.7</priority></url>
  <url><loc>https://urjadental.com/gallery</loc><priority>0.6</priority></url>
  <url><loc>https://urjadental.com/contact</loc><priority>0.7</priority></url>
</urlset>`);

  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *
Allow: /
Disallow: /admin-dashboard/
Disallow: /api/

Sitemap: https://urjadental.com/sitemap.xml`);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getCheckIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Manager</h1>
        <p className="text-gray-500">Monitor and optimize your website SEO</p>
      </div>

      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scores">SEO Scores</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="robots">Robots.txt</TabsTrigger>
          <TabsTrigger value="structured">Structured Data</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seoScores.map((page) => (
              <Card key={page.page}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{page.page}</CardTitle>
                    <span className={`text-2xl font-bold ${getScoreColor(page.score)}`}>
                      {page.score}
                    </span>
                  </div>
                  <Progress value={page.score} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {page.checks.map((check, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        {getCheckIcon(check.type)}
                        <span className="text-sm">{check.message}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sitemap" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sitemap.xml
              </CardTitle>
              <CardDescription>Auto-generated sitemap for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                rows={12}
                className="font-mono text-xs"
              />
              <div className="flex gap-2">
                <Button>Save Sitemap</Button>
                <Button variant="outline">Regenerate</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="robots" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Robots.txt
              </CardTitle>
              <CardDescription>Control search engine crawling behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
              <Button>Save Robots.txt</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structured" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5" />
                Structured Data (JSON-LD)
              </CardTitle>
              <CardDescription>
                Preview and manage structured data for rich snippets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={15}
                className="font-mono text-xs"
                defaultValue={JSON.stringify(
                  {
                    "@context": "https://schema.org",
                    "@type": "Dentist",
                    name: "Urja Dental Clinic",
                    description:
                      "Premium dental care clinic offering comprehensive dental services",
                    address: {
                      "@type": "PostalAddress",
                      streetAddress: "123 Healthcare Avenue",
                      addressLocality: "Mumbai",
                      addressRegion: "Maharashtra",
                      postalCode: "400001",
                    },
                    telephone: "+91-9876543210",
                    openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"],
                    priceRange: "₹₹",
                  },
                  null,
                  2,
                )}
              />
              <Button>Save Structured Data</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
