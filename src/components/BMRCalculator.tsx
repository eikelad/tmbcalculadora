import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Scale, Ruler, Calendar, TrendingUp, Flame } from "lucide-react";
import { toast } from "sonner";

interface BMRFormData {
  weight: string;
  height: string;
  age: string;
  gender: "male" | "female";
  activityLevel: string;
}

interface BMRResults {
  bmr: number;
  tdee: number;
  activityLabel: string;
}

const activityLevels = {
  sedentary: { multiplier: 1.2, label: "Sedentário (pouco ou nenhum exercício)" },
  light: { multiplier: 1.375, label: "Levemente ativo (1-3 dias/semana)" },
  moderate: { multiplier: 1.55, label: "Moderadamente ativo (3-5 dias/semana)" },
  active: { multiplier: 1.725, label: "Muito ativo (6-7 dias/semana)" },
  extreme: { multiplier: 1.9, label: "Extremamente ativo (atleta profissional)" },
};

export default function BMRCalculator() {
  const [formData, setFormData] = useState<BMRFormData>({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activityLevel: "moderate",
  });

  const [results, setResults] = useState<BMRResults | null>(null);

  const calculateBMR = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (!weight || !height || !age) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (weight <= 0 || height <= 0 || age <= 0) {
      toast.error("Por favor, insira valores válidos");
      return;
    }

    // Fórmula Mifflin-St Jeor (mais precisa)
    let bmr: number;
    if (formData.gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = activityLevels[formData.activityLevel as keyof typeof activityLevels].multiplier;
    const tdee = bmr * activityMultiplier;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      activityLabel: activityLevels[formData.activityLevel as keyof typeof activityLevels].label,
    });

    toast.success("Cálculo realizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-health shadow-glow mb-4">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Calculadora de Taxa Metabólica Basal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra quantas calorias seu corpo precisa diariamente para manter suas funções vitais
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="p-6 shadow-medium">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Seus Dados
            </h2>

            <div className="space-y-6">
              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Ex: 70"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  Altura (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Ex: 175"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Idade (anos)
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>Sexo</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Feminino</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label htmlFor="activity" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Nível de Atividade Física
                </Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                >
                  <SelectTrigger id="activity" className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityLevels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateBMR}
                className="w-full h-12 text-lg font-semibold bg-gradient-health hover:opacity-90 transition-opacity"
              >
                Calcular
              </Button>
            </div>
          </Card>

          {/* Results Card */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="p-6 shadow-medium bg-gradient-health text-primary-foreground">
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-8 h-8" />
                    <h3 className="text-2xl font-semibold">Taxa Metabólica Basal</h3>
                  </div>
                  <p className="text-5xl font-bold mb-2">{results.bmr} kcal</p>
                  <p className="text-primary-foreground/80">Calorias em repouso absoluto</p>
                </Card>

                <Card className="p-6 shadow-medium bg-gradient-medical text-secondary-foreground">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8" />
                    <h3 className="text-2xl font-semibold">Gasto Energético Diário</h3>
                  </div>
                  <p className="text-5xl font-bold mb-2">{results.tdee} kcal</p>
                  <p className="text-secondary-foreground/80">{results.activityLabel}</p>
                </Card>

                <Card className="p-6 shadow-soft">
                  <h3 className="text-lg font-semibold mb-3">Recomendações</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
                      <p><span className="font-semibold text-foreground">Perda de peso:</span> {results.tdee - 500} kcal/dia (-0,5kg/semana)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5" />
                      <p><span className="font-semibold text-foreground">Manutenção:</span> {results.tdee} kcal/dia</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <p><span className="font-semibold text-foreground">Ganho de massa:</span> {results.tdee + 300} kcal/dia (+0,3kg/semana)</p>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 shadow-medium h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Preencha o formulário</h3>
                <p className="text-muted-foreground">
                  Complete seus dados ao lado para calcular sua taxa metabólica basal e gasto energético diário
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">O que é TMB?</h3>
            <p className="text-sm text-muted-foreground">
              A Taxa Metabólica Basal é a quantidade de calorias que seu corpo precisa para manter funções vitais como respiração, circulação e temperatura corporal em repouso absoluto.
            </p>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fórmula Utilizada</h3>
            <p className="text-sm text-muted-foreground">
              Utilizamos a fórmula Mifflin-St Jeor, considerada uma das mais precisas atualmente para calcular o metabolismo basal, levando em conta peso, altura, idade e sexo.
            </p>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gasto Total Diário</h3>
            <p className="text-sm text-muted-foreground">
              O TDEE (Total Daily Energy Expenditure) multiplica sua TMB pelo nível de atividade física, mostrando quantas calorias você realmente gasta por dia, incluindo exercícios.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
