"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { calculateDonationPriority } from "@/lib/api";

interface Donor {
  id: string;
  name: string;
  location: string;
}

interface Center {
  id: string;
  name: string;
  location: string;
  available_capacity: number;
}

interface DonationFormProps {
  onSuccess?: () => void;
}

export default function DonationForm({ onSuccess }: DonationFormProps = {}) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);

  const [donorId, setDonorId] = useState("");
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [expiryAt, setExpiryAt] = useState("");
  const [demandScore, setDemandScore] = useState("50");
  const [donorPriority, setDonorPriority] = useState("50");
  const [location, setLocation] = useState("");
  const [centerId, setCenterId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const [
        donorsResponse,
        centersResponse,
      ] = await Promise.all([
        supabase
          .from("donors")
          .select("id,name,location")
          .order("name"),

        supabase
          .from("redistribution_centers")
          .select(
            "id,name,location,available_capacity"
          )
          .eq("status", "ACTIVE")
          .order("name"),
      ]);

      if (donorsResponse.error) {
        setError(donorsResponse.error.message);
        setLoadingData(false);
        return;
      }

      if (centersResponse.error) {
        setError(centersResponse.error.message);
        setLoadingData(false);
        return;
      }

      setDonors(donorsResponse.data ?? []);
      setCenters(centersResponse.data ?? []);
      setLoadingData(false);
    }

    loadData();
  }, []);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    if (onSuccess) onSuccess(); setMessage("");
    setError("");

    try {
      if (!donorId) {
        throw new Error("Please select a donor.");
      }

      if (!foodType.trim()) {
        throw new Error("Please enter the food type.");
      }

      const quantityNumber = Number(quantity);

      if (
        !Number.isFinite(quantityNumber) ||
        quantityNumber <= 0
      ) {
        throw new Error(
          "Quantity must be greater than zero."
        );
      }

      if (!preparedAt || !expiryAt) {
        throw new Error(
          "Please provide preparation and expiry times."
        );
      }

      const selectedDonor = donors.find(
        (donor) => donor.id === donorId
      );

      if (!selectedDonor) {
        throw new Error("Selected donor was not found.");
      }

      /*
       * Step 1:
       * Ask the Python algorithm engine to calculate
       * the donation priority.
       */
      const priority =
        await calculateDonationPriority(
          new Date(expiryAt).toISOString(),
          quantityNumber,
          Number(demandScore),
          Number(donorPriority)
        );

      /*
       * Step 2:
       * Insert the algorithm result into Supabase.
       */
      const { error: insertError } =
        await supabase
          .from("donations")
          .insert({
            donor_id: donorId,
            food_type: foodType.trim(),
            quantity: quantityNumber,
            prepared_at: new Date(
              preparedAt
            ).toISOString(),
            expiry_at: new Date(
              expiryAt
            ).toISOString(),
            demand_score: Number(demandScore),
            donor_priority: Number(donorPriority),
            location:
              location.trim() ||
              selectedDonor.location,
            status: "AVAILABLE",
            priority_score:
              priority.priority_score,
            urgency: priority.urgency,
            assigned_center_id:
              centerId || null,
          });

      if (insertError) {
        throw new Error(insertError.message);
      }

      if (onSuccess) onSuccess(); setMessage(
        `Donation registered successfully. Priority: ${priority.priority_score} (${priority.urgency})`
      );

      setFoodType("");
      setQuantity("");
      setPreparedAt("");
      setExpiryAt("");
      setDemandScore("50");
      setDonorPriority("50");
      setLocation("");
      setCenterId("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to register donation."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-xl border border-[#e5e3dd] bg-white p-6">
        <p className="text-sm text-[#737a73]">
          Loading donors and redistribution centers...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#e5e3dd] bg-white"
    >
      <div className="border-b border-[#e7e5df] px-6 py-5">
        <h2 className="text-lg font-semibold text-[#26352f]">
          Register Surplus Food
        </h2>

        <p className="mt-1 text-sm text-[#7b817a]">
          Register a new donation and calculate its
          redistribution priority.
        </p>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">
        {/* Donor */}
        <Field label="Donor">
          <select
            value={donorId}
            onChange={(event) =>
              setDonorId(event.target.value)
            }
            className="input"
            required
          >
            <option value="">
              Select donor
            </option>

            {donors.map((donor) => (
              <option
                key={donor.id}
                value={donor.id}
              >
                {donor.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Food type */}
        <Field label="Food type">
          <input
            value={foodType}
            onChange={(event) =>
              setFoodType(event.target.value)
            }
            placeholder="Prepared meals"
            className="input"
            required
          />
        </Field>

        {/* Quantity */}
        <Field label="Quantity (servings)">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            placeholder="100"
            className="input"
            required
          />
        </Field>

        {/* Location */}
        <Field label="Collection location">
          <input
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="Kengeri, Bengaluru"
            className="input"
          />
        </Field>

        {/* Prepared */}
        <Field label="Prepared at">
          <input
            type="datetime-local"
            value={preparedAt}
            onChange={(event) =>
              setPreparedAt(event.target.value)
            }
            className="input"
            required
          />
        </Field>

        {/* Expiry */}
        <Field label="Expiry at">
          <input
            type="datetime-local"
            value={expiryAt}
            onChange={(event) =>
              setExpiryAt(event.target.value)
            }
            className="input"
            required
          />
        </Field>

        {/* Demand */}
        <Field label="Demand score (0–100)">
          <input
            type="number"
            min="0"
            max="100"
            value={demandScore}
            onChange={(event) =>
              setDemandScore(event.target.value)
            }
            className="input"
          />
        </Field>

        {/* Donor priority */}
        <Field label="Donor priority (0–100)">
          <input
            type="number"
            min="0"
            max="100"
            value={donorPriority}
            onChange={(event) =>
              setDonorPriority(event.target.value)
            }
            className="input"
          />
        </Field>

        {/* Center */}
        <Field label="Preferred redistribution center">
          <select
            value={centerId}
            onChange={(event) =>
              setCenterId(event.target.value)
            }
            className="input"
          >
            <option value="">
              Auto-select later
            </option>

            {centers.map((center) => (
              <option
                key={center.id}
                value={center.id}
              >
                {center.name} —{" "}
                {center.available_capacity} available
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Formula */}
      <div className="mx-6 mb-5 rounded-lg border border-[#dfe8e2] bg-[#f4f8f5] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718178]">
          Priority calculation
        </div>

        <div className="mt-2 text-sm text-[#4e5b53]">
          Score = 0.45 × Expiry + 0.25 × Quantity +
          0.20 × Demand + 0.10 × Donor Priority
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div className="mx-6 mb-5 rounded-lg border border-[#cfe3d6] bg-[#edf7f0] px-4 py-3 text-sm text-[#286044]">
          {message}
        </div>
      )}

      {error && (
        <div className="mx-6 mb-5 rounded-lg border border-[#ead3d0] bg-[#fdf1ef] px-4 py-3 text-sm text-[#9a4038]">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end border-t border-[#e7e5df] px-6 py-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#173f35] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#245748] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Registering..."
            : "Register Donation"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[#59615a]">
        {label}
      </span>

      {children}
    </label>
  );
}