"use client";

import { useState } from "react";
import { Star, ExternalLink, Settings, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewsPage() {
  const [embedUrl, setEmbedUrl] = useState("https://www.google.com/maps/embed?pb=...");
  const [isEnabled, setIsEnabled] = useState(true);
  const [showOnHomepage, setShowOnHomepage] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Google Reviews</h1>
        <p className="text-gray-500">Manage Google Reviews display settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Review Settings
            </CardTitle>
            <CardDescription>Configure how Google Reviews appear on your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Reviews Section</p>
                <p className="text-sm text-gray-500">Show Google Reviews on the website</p>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Display on Homepage</p>
                <p className="text-sm text-gray-500">Show reviews on the homepage</p>
              </div>
              <Switch checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
            </div>
            <div className="space-y-2">
              <Label>Google Reviews Embed URL</Label>
              <Textarea
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                rows={3}
                placeholder="Paste your Google Maps embed URL here"
              />
              <p className="text-xs text-gray-500">
                Get this from Google Maps → Share → Embed a map
              </p>
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>How reviews will appear on your website</CardDescription>
          </CardHeader>
          <CardContent>
            {isEnabled ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(127 reviews)</span>
                </div>
                <div className="aspect-video bg-white rounded border flex items-center justify-center">
                  <p className="text-sm text-gray-400">Google Reviews Widget Preview</p>
                </div>
                <div className="mt-3 text-center">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Write a Review
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <p className="text-sm text-gray-500">Reviews section is disabled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
