// src/pages/hospitals/CreateHospital.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHospitals } from "@/hooks/useHospitals";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  contactEmail: z.string().email(),
  address: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export default function CreateHospital() {
  const navigate = useNavigate();
  const { addHospital, loading } = useHospitals();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      country: "",
      contactEmail: "",
      address: "",
      phone: "",
      description: "",
    },
  });

  async function onSubmit(values) {
    try {
      await addHospital(values);
      toast.success("Hospital created");
      navigate("/hospitals");
    } catch (e) {
      toast.error("Failed to create hospital");
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Hospital</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {["name", "city", "state", "country", "contactEmail"].map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name || field}</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create"}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
