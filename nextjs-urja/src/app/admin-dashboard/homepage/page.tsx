"use client";

import { useState, useEffect } from "react";
import { Save, Image, Type, Link, Calendar, Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageDropzone } from "@/components/admin/drag-drop-image-upload";

interface WhyUrjaPillar {
  tag: string;
  headline: string;
  body: string;
  image: string;
  fallbackGradient: string;
  imageAlt: string;
  nudge: string;
}

const DEFAULT_PILLARS: WhyUrjaPillar[] = [
  {
    tag: "Zero anxiety",
    headline: "We treat the person,\nnot just the tooth.",
    body: "Every visit starts with a conversation. Our pain-free protocols and calm environment make even nervous patients feel at home.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    fallbackGradient: "linear-gradient(135deg, #e8d5c0 0%, #d4b896 50%, #c9a97a 100%)",
    imageAlt: "Patient receiving gentle dental treatment at Urja",
    nudge: "mt-0",
  },
  {
    tag: "Precision tech",
    headline: "Diagnosed right\nthe first time.",
    body: "3D digital scans, intraoral cameras, and AI-assisted analysis — no guesswork, no repeat visits.",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&q=80",
    fallbackGradient: "linear-gradient(135deg, #d6e8d5 0%, #a8ccb0 50%, #7daf8a 100%)",
    imageAlt: "Advanced digital scanning technology at Urja Dental",
    nudge: "mt-16 md:mt-24",
  },
  {
    tag: "Honest care",
    headline: "We tell you what\nyou actually need.",
    body: "Transparent treatment plans with fixed pricing. No upsells, no unnecessary procedures — ever.",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
    fallbackGradient: "linear-gradient(135deg, #d5dde8 0%, #96adc9 50%, #7a96b8 100%)",
    imageAlt: "Urja dental team in a modern clean clinic",
    nudge: "mt-8 md:mt-12",
  },
];

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #e8d5c0 0%, #d4b896 50%, #c9a97a 100%)",
  "linear-gradient(135deg, #d6e8d5 0%, #a8ccb0 50%, #7daf8a 100%)",
  "linear-gradient(135deg, #d5dde8 0%, #96adc9 50%, #7a96b8 100%)",
  "linear-gradient(135deg, #f0d4e0 0%, #e0a0b8 50%, #d0809a 100%)",
  "linear-gradient(135deg, #f0e6d0 0%, #e0c8a0 50%, #d0b080 100%)",
  "linear-gradient(135deg, #d0e0f0 0%, #a0c0e0 50%, #80a0d0 100%)",
];

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

  const [heroBackground, setHeroBackground] = useState<string | null>(null);
  const [offerBanner, setOfferBanner] = useState<string | null>(null);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  // ── Why Urja pillars state ──────────────────────────────────────────────
  const [whyUrjaPillars, setWhyUrjaPillars] = useState<WhyUrjaPillar[]>(DEFAULT_PILLARS);
  const [whyUrjaSaving, setWhyUrjaSaving] = useState(false);
  const [whyUrjaLoadError, setWhyUrjaLoadError] = useState(false);

  useEffect(() => {
    loadWhyUrja();
  }, []);

  async function loadWhyUrja() {
    try {
      const res = await fetch("/api/admin/why-urja");
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setWhyUrjaPillars(json.data);
      }
    } catch (e) {
      console.warn("Could not load Why Urja from API, using defaults", e);
      setWhyUrjaLoadError(true);
    }
  }

  async function saveWhyUrja() {
    setWhyUrjaSaving(true);
    try {
      const res = await fetch("/api/admin/why-urja", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillars: whyUrjaPillars }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const json = await res.json();
      if (json.success) {
        alert("Why Urja pillars saved successfully!");
      }
    } catch (e) {
      console.error("Failed to save Why Urja pillars", e);
      alert("Failed to save Why Urja pillars");
    } finally {
      setWhyUrjaSaving(false);
    }
  }

  function updatePillar(index: number, field: keyof WhyUrjaPillar, value: string) {
    const updated = [...whyUrjaPillars];
    updated[index] = { ...updated[index], [field]: value };
    setWhyUrjaPillars(updated);
  }

  function addPillar() {
    setWhyUrjaPillars([
      ...whyUrjaPillars,
      {
        tag: "",
        headline: "",
        body: "",
        image: "",
        fallbackGradient: FALLBACK_GRADIENTS[whyUrjaPillars.length % FALLBACK_GRADIENTS.length],
        imageAlt: "",
        nudge: "mt-0",
      },
    ]);
  }

  function removePillar(index: number) {
    setWhyUrjaPillars(whyUrjaPillars.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Manager</h1>
          <p className="text-gray-500">Customize your website homepage sections</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="usp">USP Section</TabsTrigger>
          <TabsTrigger value="why-urja">Why Urja</TabsTrigger>
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
              <ImageDropzone
                folder="urja-dental/homepage/hero"
                label="Background Image"
                value={heroBackground}
                onChange={setHeroBackground}
                tags={["homepage", "hero"]}
              />
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

        {/* ─────────────────────────────────────────────────────────────── */}
        {/* Why Urja Tab */}
        {/* ─────────────────────────────────────────────────────────────── */}
        <TabsContent value="why-urja" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Why Urja Section</CardTitle>
                  <CardDescription>
                    The three pillars displayed on the homepage — "Why choose us" cards with image, tag, headline, and body text
                  </CardDescription>
                </div>
                <Button onClick={saveWhyUrja} disabled={whyUrjaSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {whyUrjaSaving ? "Saving..." : "Save Pillars"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {whyUrjaPillars.map((pillar, idx) => (
                <div key={idx} className="border rounded-lg p-5 space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-700">Pillar #{idx + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePillar(idx)}
                      disabled={whyUrjaPillars.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tag (e.g. "Zero anxiety")</Label>
                      <Input
                        placeholder="Pillar tag"
                        value={pillar.tag}
                        onChange={(e) => updatePillar(idx, "tag", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nudge (e.g. "mt-0", "mt-16 md:mt-24")</Label>
                      <Input
                        placeholder="Tailwind margin class for stagger"
                        value={pillar.nudge}
                        onChange={(e) => updatePillar(idx, "nudge", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Headline (use \n for line breaks)</Label>
                    <Textarea
                      placeholder="Headline text"
                      value={pillar.headline}
                      onChange={(e) => updatePillar(idx, "headline", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Body Text</Label>
                    <Textarea
                      placeholder="Body description"
                      value={pillar.body}
                      onChange={(e) => updatePillar(idx, "body", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      value={pillar.image}
                      onChange={(e) => updatePillar(idx, "image", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image Alt Text</Label>
                    <Input
                      placeholder="Descriptive alt text for the image"
                      value={pillar.imageAlt}
                      onChange={(e) => updatePillar(idx, "imageAlt", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fallback Gradient CSS</Label>
                    <Input
                      placeholder="linear-gradient(...)"
                      value={pillar.fallbackGradient}
                      onChange={(e) => updatePillar(idx, "fallbackGradient", e.target.value)}
                    />
                    <div
                      className="h-6 w-full rounded-md mt-1"
                      style={{ background: pillar.fallbackGradient }}
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addPillar}>
                <Plus className="mr-2 h-4 w-4" /> Add Pillar
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
              <ImageDropzone
                folder="urja-dental/homepage/offers"
                label="Banner Image"
                value={offerBanner}
                onChange={setOfferBanner}
                tags={["homepage", "offer"]}
              />
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
              <ImageDropzone
                folder="urja-dental/homepage/popup"
                label="Popup Image"
                value={popupImage}
                onChange={setPopupImage}
                tags={["homepage", "popup"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}