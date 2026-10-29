"use client";

import { useEffect, useMemo, useState } from "react";

import DonationForm from "@/components/DonationForm";
import {
  getDonations,
  type Donation,
} from "@/lib/donations";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function loadDonations() {
    try {
      setLoading(true);
      setError("");

      const data = await getDonations();

      setDonations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load donations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  const statistics = useMemo(() => {
    const available = donations.filter(
      (donation) =>
        donation.status === "AVAILABLE"
    ).length;

    const critical = donations.filter(
      (donation) =>
        donation.urgency === "CRITICAL"
    ).length;

    const high = donations.filter(
      (donation) =>
        donation.urgency === "HIGH"
    ).length;

    const totalQuantity = donations.reduce(
      (sum, donation) =>
        sum + Number(donation.quantity),
      0
    );

    return {
      total: donations.length,
      available,
      critical,
      high,
      totalQuantity,
    };
  }, [donations]);

  function formatDate(value: string) {
    return new Date(value).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  function urgencyClass(urgency: string) {
    switch (urgency) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200";

      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  }

  return (
    <div className="space-y-6">

      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#6f887b]">
            Food inventory
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#26352d]">
            Donations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f746f]">
            Register surplus food, calculate its urgency,
            and prioritize redistribution using the
            FoodRescue algorithm engine.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-[#385c4d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2e4d41]"
        >
          + Register Donation
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* STATISTICS */}
      {/* ------------------------------------------------ */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

        <div className="rounded-xl border border-[#e2e0d8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#858b86]">
            Total
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#26352d]">
            {statistics.total}
          </p>
        </div>

        <div className="rounded-xl border border-[#e2e0d8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#858b86]">
            Available
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#385c4d]">
            {statistics.available}
          </p>
        </div>

        <div className="rounded-xl border border-[#e2e0d8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#858b86]">
            Critical
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {statistics.critical}
          </p>
        </div>

        <div className="rounded-xl border border-[#e2e0d8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#858b86]">
            High
          </p>

          <p className="mt-2 text-2xl font-semibold text-orange-600">
            {statistics.high}
          </p>
        </div>

        <div className="rounded-xl border border-[#e2e0d8] bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#858b86]">
            Food quantity
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#26352d]">
            {statistics.totalQuantity}
          </p>

          <p className="mt-1 text-xs text-[#858b86]">
            servings
          </p>
        </div>

      </div>

      {/* ------------------------------------------------ */}
      {/* ERROR */}
      {/* ------------------------------------------------ */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">
            Unable to load donations
          </p>

          <p className="mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDonations}
            className="mt-3 rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* DONATIONS TABLE */}
      {/* ------------------------------------------------ */}

      <div className="overflow-hidden rounded-xl border border-[#e2e0d8] bg-white">

        <div className="border-b border-[#e8e6df] px-6 py-4">
          <h2 className="font-semibold text-[#26352d]">
            Donation Queue
          </h2>

          <p className="mt-1 text-xs text-[#858b86]">
            Highest-priority donations appear first.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-[#858b86]">
            Loading donations...
          </div>
        ) : donations.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-[#26352d]">
              No donations registered yet.
            </p>

            <p className="mt-2 text-sm text-[#858b86]">
              Register the first surplus-food donation
              to begin the redistribution workflow.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-lg bg-[#385c4d] px-4 py-2.5 text-sm font-medium text-white"
            >
              Register Donation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-[#faf9f6]">
                <tr className="border-b border-[#e8e6df]">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Food
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Quantity
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Location
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Expiry
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Priority
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Urgency
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#858b86]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {donations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="border-b border-[#eeeDE7] last:border-0"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#26352d]">
                        {donation.food_type}
                      </p>

                      <p className="mt-1 text-xs text-[#858b86]">
                        ID: {donation.id.slice(0, 8)}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#4c5952]">
                      {donation.quantity} servings
                    </td>

                    <td className="px-6 py-4 text-sm text-[#4c5952]">
                      {donation.location}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#4c5952]">
                      {formatDate(donation.expiry_at)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#385c4d]">
                        {Number(
                          donation.priority_score
                        ).toFixed(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${urgencyClass(
                          donation.urgency
                        )}`}
                      >
                        {donation.urgency}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-[#536158]">
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* DONATION FORM MODAL */}
      {/* ------------------------------------------------ */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#faf9f6] shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2e0d8] bg-[#faf9f6] px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-[#26352d]">
                  Register Donation
                </h2>

                <p className="mt-1 text-xs text-[#858b86]">
                  Priority is calculated by the Python
                  algorithm engine.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md px-3 py-2 text-sm text-[#6f746f] hover:bg-white"
              >
                ✕
              </button>

            </div>

            <div className="p-6">

              <DonationForm
                onSuccess={() => {
                  setShowForm(false);
                  loadDonations();
                }}
              />

            </div>
          </div>
        </div>
      )}

    </div>
  );
}