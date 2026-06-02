"use client";

import { useState } from "react";
import { Save, Image, Type, Link, Calendar, Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomepageManagerPage() {
  const [heroHeading, setHeroHeading] = useState("Your Smile, Our Passion");
  const [heroSubheading, setHeroSubheading] = useState(
    "Experience world-class dental care with cutting-edge technology and compassionate professionals.",
  );
  const [ctaButtons, setCtaButtons] = useState([
    { label: "Book Appointment", link: "/book-appointment" },
    { label: "Our Services", link: "/services" },
  ]);

  const [uspItems, setUspItems] = useState([
    { icon: "🦷", title: "Expert Dentists", description: "Highly qualified & experienced team" },
    { icon: "🏥", title: "Modern Clinic", description: "State-of-the-art equipment & facilities" },
    {
      icon: "💯",
      title: "Painless Care",
      description: "Advanced techniques for comfortable treatment",
    },
    { icon: "⏰", title: "Flexible Hours", description: "Convenient scheduling for your needs" },
  ]);

  const [offer, setOffer] = useState({
    offerText: "Get 20% off on Teeth Whitening this month!",
    expiryDate: "2026-02-28",
    isActive: true,
  });

  const [popup, setPopup] = useState({
    message: "Special Offer: Free Dental Checkup this week!",
    ctaText: "Book Now",
    ctaLink: "/book-appointment",
    isActive: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Manager</h1>
          <p className="text-gray-500">Customize your website homepage sections</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="usp">USP Section</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="popup">Popup</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hero Section</CardTitle>
              <CardDescription>
                Main banner content displayed at the top of the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subheading</Label>
                <Textarea
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Background Image</Label>
                <Input type="file" accept="image/*" />
              </div>
              <div className="space-y-3">
                <Label>CTA Buttons</Label>
                {ctaButtons.map((btn, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Button label"
                      value={btn.label}
                      className="flex-1"
                      onChange={(e) => {
                        const updated = [...ctaButtons];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setCtaButtons(updated);
                      }}
                    />
                    <Input
                      placeholder="Link URL"
                      value={btn.link}
                      className="flex-1"
                      onChange={(e) => {
                        const updated = [...ctaButtons];
                        updated[idx] = { ...updated[idx], link: e.target.value };
                        setCtaButtons(updated);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCtaButtons(ctaButtons.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCtaButtons([...ctaButtons, { label: "", link: "" }])}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Button
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usp" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">USP Section</CardTitle>
              <CardDescription>Why choose us - unique selling points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uspItems.map((item, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                    <Input
                      placeholder="Icon (emoji)"
                      value={item.icon}
                      className="w-20"
                      onChange={(e) => {
                        const updated = [...uspItems];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setUspItems(updated);
                      }}
                    />
                    <Input
                      placeholder="Title"
                      value={item.title}
                      className="flex-1"
                      onChange={(e) => {
                        const updated = [...uspItems];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setUspItems(updated);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUspItems(uspItems.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...uspItems];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setUspItems(updated);
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUspItems([...uspItems, { icon: "", title: "", description: "" }])}
              >
                <Plus className="mr-2 h-4 w-4" /> Add USP
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Promotional Offers</CardTitle>
              <CardDescription>Manage promotional banners and offers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Offer Banner</p>
                  <p className="text-sm text-gray-500">Show promotional offer on the website</p>
                </div>
                <Switch
                  checked={offer.isActive}
                  onCheckedChange={(v) => setOffer({ ...offer, isActive: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Offer Text</Label>
                <Textarea
                  value={offer.offerText}
                  onChange={(e) => setOffer({ ...offer, offerText: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={offer.expiryDate}
                  onChange={(e) => setOffer({ ...offer, expiryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <Input type="file" accept="image/*" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popup" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Homepage Popup</CardTitle>
              <CardDescription>
                Configure popup that appears when visitors land on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Popup</p>
                  <p className="text-sm text-gray-500">Show popup when visitors arrive</p>
                </div>
                <Switch
                  checked={popup.isActive}
                  onCheckedChange={(v) => setPopup({ ...popup, isActive: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Popup Message</Label>
                <Textarea
                  value={popup.message}
                  onChange={(e) => setPopup({ ...popup, message: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={popup.ctaText}
                    onChange={(e) => setPopup({ ...popup, ctaText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={popup.ctaLink}
                    onChange={(e) => setPopup({ ...popup, ctaLink: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Popup Image</Label>
                <Input type="file" accept="image/*" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
