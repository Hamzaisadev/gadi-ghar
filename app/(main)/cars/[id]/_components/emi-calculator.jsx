"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  formatCurrency,
  formatPriceRange,
} from "@/components/utils/FormatCurrency";

export default function EmiCalculator({ price }) {
  const [loanAmount, setLoanAmount] = useState(price * 0.8); // 80% of car price
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(60); // months
  const [downPayment, setDownPayment] = useState(price * 0.2); // 20% down payment
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Calculate EMI
  useEffect(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const numPayments = tenure;

    if (principal > 0 && monthlyRate > 0 && numPayments > 0) {
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

      const totalPaymentValue = emiValue * numPayments;
      const totalInterestValue = totalPaymentValue - principal;

      setEmi(emiValue);
      setTotalPayment(totalPaymentValue);
      setTotalInterest(totalInterestValue);
    }
  }, [loanAmount, interestRate, tenure]);

  // Update loan amount when down payment changes
  useEffect(() => {
    setLoanAmount(price - downPayment);
  }, [downPayment, price]);

  const handleDownPaymentChange = (value) => {
    const newDownPayment = Math.max(0, Math.min(price, value[0]));
    setDownPayment(newDownPayment);
  };

  const handleTenureChange = (value) => {
    setTenure(value[0]);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value[0]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Loan Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Car Price */}
          <div className="space-y-2">
            <Label>Car Price</Label>
            <div className="text-2xl font-bold text-blue-600">
              {formatPriceRange(price)}
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Down Payment</Label>
              <span className="text-sm font-medium">
                {formatCurrency(downPayment)} (
                {((downPayment / price) * 100).toFixed(0)}%)
              </span>
            </div>
            <Slider
              value={[downPayment]}
              onValueChange={handleDownPaymentChange}
              max={price}
              min={price * 0.1} // Minimum 10%
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min: {formatCurrency(price * 0.1)}</span>
              <span>Max: {formatCurrency(price)}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Interest Rate (Annual)</Label>
              <span className="text-sm font-medium">{interestRate}%</span>
            </div>
            <Slider
              value={[interestRate]}
              onValueChange={handleInterestRateChange}
              max={15}
              min={5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Loan Tenure</Label>
              <span className="text-sm font-medium">
                {tenure} months ({Math.round(tenure / 12)} years)
              </span>
            </div>
            <Slider
              value={[tenure]}
              onValueChange={handleTenureChange}
              max={84} // 7 years
              min={12} // 1 year
              step={6}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 year</span>
              <span>7 years</span>
            </div>
          </div>

          {/* Results */}
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Monthly EMI</div>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(emi)}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Payment</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(totalPayment + downPayment)}
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Interest</div>
                <div className="text-lg font-bold text-orange-600">
                  {formatCurrency(totalInterest)}
                </div>
              </div>
            </div>
          </div>

          {/* Loan Amount */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Loan Amount</div>
            <div className="text-xl font-bold">
              {formatCurrency(loanAmount)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Down Payment</span>
              <span className="text-sm font-medium">
                {formatCurrency(downPayment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Principal Amount</span>
              <span className="text-sm font-medium">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Interest</span>
              <span className="text-sm font-medium">
                {formatCurrency(totalInterest)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Cost</span>
              <span className="font-bold">
                {formatCurrency(totalPayment + downPayment)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
