"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Target,
  DollarSign,
  Users,
  Image,
  FileCheck,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const steps = [
  { label: "Platform", icon: Target },
  { label: "Hedef", icon: FileCheck },
  { label: "Butce", icon: DollarSign },
  { label: "Hedef Kitle", icon: Users },
  { label: "Gorsel", icon: Image },
  { label: "Inceleme", icon: Check },
]

const platforms = [
  {
    id: "google",
    name: "Google Ads",
    description: "Arama, Gorsel, YouTube, Alisveris",
  },
  {
    id: "meta",
    name: "Meta Ads",
    description: "Facebook, Instagram, Messenger",
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    description: "In-Feed, TopView, Markali Efektler",
  },
]

const objectives = [
  { id: "awareness", name: "Marka Bilinirlik", description: "Marka gorunurlugunuzu ve erisiminizi artirin" },
  { id: "traffic", name: "Web Sitesi Trafigi", description: "Web sitenize ziyaretci cekin" },
  { id: "conversions", name: "Donusumler", description: "Satis ve kayit icin optimize edin" },
  { id: "leads", name: "Potansiyel Musteri", description: "Iletisim bilgilerini toplayin" },
  { id: "engagement", name: "Etkilesim", description: "Begeni, yorum ve paylasim artirin" },
  { id: "app_installs", name: "Uygulama Yuklemeleri", description: "Mobil uygulama indirmelerini artirin" },
]

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    platform: "",
    objective: "",
    campaignName: "",
    budget: 5000,
    budgetType: "daily",
    startDate: "",
    endDate: "",
    ageMin: 18,
    ageMax: 65,
    gender: "all",
    locations: "Turkiye",
    interests: "",
    headline: "",
    description: "",
    autoOptimize: true,
  })

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Kampanya Olustur
        </h1>
        <p className="text-sm text-muted-foreground">
          Bagli platformlariniz uzerinden yeni bir reklam kampanyasi kurun.
        </p>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-1">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div key={step.label} className="flex items-center gap-1">
              <button
                onClick={() => index <= currentStep && setCurrentStep(index)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isCompleted &&
                    "bg-primary/10 text-primary",
                  isCurrent &&
                    "bg-primary text-primary-foreground",
                  !isCompleted &&
                    !isCurrent &&
                    "text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <StepIcon className="size-4" />
                )}
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="size-4 text-muted-foreground/40" />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          {/* Step 0: Platform */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Platform Secin
              </h2>
              <p className="text-sm text-muted-foreground">
                Kampanyaniz icin reklam platformunu secin.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => updateField("platform", platform.id)}
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border p-5 text-left transition-all",
                      formData.platform === platform.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-secondary hover:border-primary/40"
                    )}
                  >
                    <span className="font-medium text-foreground">
                      {platform.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {platform.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Objective */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                Kampanya Hedefi
              </h2>
              <p className="text-sm text-muted-foreground">
                Bu kampanya ile ne elde etmek istiyorsunuz?
              </p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="campaignName" className="text-foreground">Kampanya Adi</Label>
                <Input
                  id="campaignName"
                  value={formData.campaignName}
                  onChange={(e) => updateField("campaignName", e.target.value)}
                  placeholder="orn. Yaz Indirimi 2026"
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => updateField("objective", obj.id)}
                    className={cn(
                      "flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-all",
                      formData.objective === obj.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border bg-secondary hover:border-primary/40"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {obj.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {obj.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{"Butce & Takvim"}</h2>
                <p className="text-sm text-muted-foreground">
                  Kampanya butcenizi ve zamanlama tercihlerinizi belirleyin.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Butce Turu</Label>
                  <Select
                    value={formData.budgetType}
                    onValueChange={(v) => updateField("budgetType", v)}
                  >
                    <SelectTrigger className="border-border bg-secondary text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Gunluk Butce</SelectItem>
                      <SelectItem value="lifetime">Toplam Butce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Butce Miktari</Label>
                    <span className="font-mono text-lg font-bold text-primary">
                      ₺{formData.budget.toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={[formData.budget]}
                    onValueChange={([v]) => updateField("budget", v)}
                    max={50000}
                    min={100}
                    step={100}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₺100</span>
                    <span>₺50.000</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="startDate" className="text-foreground">Baslangic Tarihi</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="endDate" className="text-foreground">Bitis Tarihi</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                      className="border-border bg-secondary text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Butceyi otomatik optimize et
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Butceyi en iyi performans gosteren reklamlara otomatik dagit
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoOptimize}
                    onCheckedChange={(v) => updateField("autoOptimize", v)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Audience */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Hedef Kitle</h2>
                <p className="text-sm text-muted-foreground">
                  Reklamlarinizi kimlerin gormesi gerektigini tanimlayin.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Minimum Yas</Label>
                    <Select
                      value={String(formData.ageMin)}
                      onValueChange={(v) => updateField("ageMin", parseInt(v))}
                    >
                      <SelectTrigger className="border-border bg-secondary text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[13, 18, 21, 25, 30, 35, 40, 45, 50].map((age) => (
                          <SelectItem key={age} value={String(age)}>
                            {age} yas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Maksimum Yas</Label>
                    <Select
                      value={String(formData.ageMax)}
                      onValueChange={(v) => updateField("ageMax", parseInt(v))}
                    >
                      <SelectTrigger className="border-border bg-secondary text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[25, 30, 35, 40, 45, 50, 55, 60, 65].map((age) => (
                          <SelectItem key={age} value={String(age)}>
                            {age} yas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Cinsiyet</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) => updateField("gender", v)}
                  >
                    <SelectTrigger className="border-border bg-secondary text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tumu</SelectItem>
                      <SelectItem value="male">Erkek</SelectItem>
                      <SelectItem value="female">Kadin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="locations" className="text-foreground">Konumlar</Label>
                  <Input
                    id="locations"
                    value={formData.locations}
                    onChange={(e) => updateField("locations", e.target.value)}
                    placeholder="orn. Turkiye, Almanya"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="interests" className="text-foreground">{"Ilgi Alanlari & Anahtar Kelimeler"}</Label>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => updateField("interests", e.target.value)}
                    placeholder="orn. teknoloji, fitness, moda..."
                    className="min-h-24 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Creative */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Gorsel Yukleme</h2>
                <p className="text-sm text-muted-foreground">
                  Reklam metninizi ve gorsel varliklarinizi ekleyin.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="headline" className="text-foreground">Baslik</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => updateField("headline", e.target.value)}
                    placeholder="orn. Yaz Koleksiyonunu Kesfedin"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="adDescription" className="text-foreground">Aciklama</Label>
                  <Textarea
                    id="adDescription"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Etkileyici reklam metni yazin..."
                    className="min-h-24 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Upload area */}
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Gorsel Varliklar</Label>
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/50 p-12 transition-colors hover:border-primary/40">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <Upload className="size-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        {"Dosyalari buraya surukleyin & birakin"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {"PNG, JPG, MP4 - maks. 50MB"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border text-muted-foreground">
                      Dosya Sec
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{"Incele & Yayinla"}</h2>
                <p className="text-sm text-muted-foreground">
                  Yayinlamadan once kampanya ayarlarinizi gozden gecirin.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Platform", value: platforms.find((p) => p.id === formData.platform)?.name || "Secilmedi" },
                  { label: "Hedef", value: objectives.find((o) => o.id === formData.objective)?.name || "Secilmedi" },
                  { label: "Kampanya Adi", value: formData.campaignName || "Belirlenmedi" },
                  { label: "Butce", value: `₺${formData.budget.toLocaleString()} (${formData.budgetType === "daily" ? "gunluk" : "toplam"})` },
                  { label: "Yas Araligi", value: `${formData.ageMin} - ${formData.ageMax}` },
                  { label: "Cinsiyet", value: formData.gender === "all" ? "Tumu" : formData.gender === "male" ? "Erkek" : "Kadin" },
                  { label: "Konumlar", value: formData.locations || "Belirlenmedi" },
                  { label: "Baslik", value: formData.headline || "Belirlenmedi" },
                  { label: "Otomatik Optimizasyon", value: formData.autoOptimize ? "Acik" : "Kapali" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-secondary p-3"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prev}
          disabled={currentStep === 0}
          className="gap-2 border-border text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Onceki
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button
            onClick={() => router.push("/dashboard")}
            className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
          >
            <Check className="size-4" />
            Kampanyayi Yayinla
          </Button>
        ) : (
          <Button
            onClick={next}
            className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
          >
            Sonraki
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
