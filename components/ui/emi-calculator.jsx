"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Calculator, IndianRupee, Percent, Calendar, TrendingUp, Info } from "lucide-react"
import { Slider } from "@radix-ui/react-slider"
import { formatPriceRange, formatCurrency } from "@/components/utils/FormatCurrency"

const EMICalculator = React.forwardRef(({
  className,
  price,
  minPrice,
  maxPrice,
  defaultCarPrice = 500000,
  defaultDownPayment = 100000,
  defaultLoanTerm = 5,
  defaultInterestRate = 9.5,
  onCalculate,
  showAdvanced = false,
  ...props
}, ref) => {
  // Use actual car price or default
  const actualCarPrice = price || defaultCarPrice
  const actualMinPrice = minPrice || defaultCarPrice * 0.8
  const actualMaxPrice = maxPrice || defaultCarPrice * 1.2
  
  const [carPrice, setCarPrice] = React.useState(actualCarPrice)
  const [downPayment, setDownPayment] = React.useState(actualCarPrice * 0.2) // 20% default
  const [loanTerm, setLoanTerm] = React.useState(defaultLoanTerm)
  const [interestRate, setInterestRate] = React.useState(defaultInterestRate)
  const [isAdvanced, setIsAdvanced] = React.useState(showAdvanced)
  const [priceRange, setPriceRange] = React.useState({ min: 500000, max: 50000000 })
  const [loading, setLoading] = React.useState(true)
  
  // Advanced options
  const [processingFee, setProcessingFee] = React.useState(10000)
  const [insurance, setInsurance] = React.useState(25000)
  const [roadTax, setRoadTax] = React.useState(15000)

  // Calculate EMI and related values
  const calculateEMI = React.useMemo(() => {
    const principal = carPrice - downPayment
    const monthlyRate = interestRate / (12 * 100)
    const numPayments = loanTerm * 12

    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return {
        emi: 0,
        totalAmount: 0,
        totalInterest: 0,
        loanAmount: principal,
        monthlyRate,
        numPayments
      }
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                 (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    const totalAmount = emi * numPayments
    const totalInterest = totalAmount - principal
    
    const result = {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      loanAmount: principal,
      monthlyRate,
      numPayments
    }
    
    onCalculate?.(result)
    return result
  }, [carPrice, downPayment, loanTerm, interestRate, onCalculate])

  const totalCostOnRoad = React.useMemo(() => {
    if (isAdvanced) {
      return carPrice + processingFee + insurance + roadTax
    }
    return carPrice
  }, [carPrice, processingFee, insurance, roadTax, isAdvanced])

  const formatCurrencyPKR = (amount) => {
    return formatCurrency(amount) || "PKR 0"
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-PK').format(num)
  }

  return (
    <Card ref={ref} className={cn("w-full max-w-2xl mx-auto", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl md:text-2xl">
          <Calculator className="h-6 w-6 text-primary" />
          EMI Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate your monthly car loan payments
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Car Price */}
        <div className="space-y-3">
          <Label htmlFor="car-price" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Car Price
          </Label>
          <div className="space-y-2">
            <Input
              id="car-price"
              type="number"
              value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              min="100000"
              max="10000000"
              step="10000"
              className="text-lg font-medium"
              inputMode="numeric"
            />
            <Slider
              value={[carPrice]}
              onValueChange={(value) => setCarPrice(value[0])}
              max={actualMaxPrice}
              min={actualMinPrice}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPriceRange(actualMinPrice, actualMinPrice)}</span>
              <span className="font-medium">{formatCurrencyPKR(carPrice)}</span>
              <span>{formatPriceRange(actualMaxPrice, actualMaxPrice)}</span>
            </div>
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <Label htmlFor="down-payment" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Down Payment ({Math.round((downPayment / carPrice) * 100)}%)
          </Label>
          <div className="space-y-2">
            <Input
              id="down-payment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              min="0"
              max={carPrice * 0.8}
              step="5000"
              className="text-lg font-medium"
              inputMode="numeric"
            />
            <Slider
              value={[downPayment]}
              onValueChange={(value) => setDownPayment(value[0])}
              max={carPrice * 0.8}
              min={0}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>PKR 0</span>
              <span className="font-medium">{formatCurrencyPKR(downPayment)}</span>
              <span>{formatCurrencyPKR(carPrice * 0.8)}</span>
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-3">
          <Label htmlFor="loan-term" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Loan Term (Years)
          </Label>
          <div className="space-y-2">
            <Input
              id="loan-term"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              min="1"
              max="7"
              step="1"
              className="text-lg font-medium"
              inputMode="numeric"
            />
            <Slider
              value={[loanTerm]}
              onValueChange={(value) => setLoanTerm(value[0])}
              max={7}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 Year</span>
              <span className="font-medium">{loanTerm} Years</span>
              <span>7 Years</span>
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <Label htmlFor="interest-rate" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Interest Rate (% per annum)
          </Label>
          <div className="space-y-2">
            <Input
              id="interest-rate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min="6"
              max="20"
              step="0.1"
              className="text-lg font-medium"
              inputMode="decimal"
            />
            <Slider
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
              max={20}
              min={6}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6%</span>
              <span className="font-medium">{interestRate}%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="w-full"
          >
            {isAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
        </div>

        {/* Advanced Options */}
        {isAdvanced && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Additional Costs
            </h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="processing-fee">Processing Fee</Label>
                <Input
                  id="processing-fee"
                  type="number"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value))}
                  min="0"
                  step="1000"
                  inputMode="numeric"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  min="0"
                  step="1000"
                  inputMode="numeric"
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="road-tax">Road Tax & Others</Label>
                <Input
                  id="road-tax"
                  type="number"
                  value={roadTax}
                  onChange={(e) => setRoadTax(Number(e.target.value))}
                  min="0"
                  step="1000"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Loan Details</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Monthly EMI - Most prominent */}
            <div className="sm:col-span-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Monthly EMI</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrencyPKR(calculateEMI.emi)}
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-xl font-semibold">
                {formatCurrencyPKR(calculateEMI.loanAmount)}
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-xl font-semibold">
                {formatCurrencyPKR(calculateEMI.totalInterest)}
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Amount Paid</p>
              <p className="text-xl font-semibold">
                {formatCurrencyPKR(calculateEMI.totalAmount)}
              </p>
            </div>
            
            {isAdvanced && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total On-Road Price</p>
                <p className="text-xl font-semibold">
                  {formatCurrencyPKR(totalCostOnRoad)}
                </p>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Loan Period: {loanTerm} years ({loanTerm * 12} months)</p>
            <p>• Interest Rate: {interestRate}% per annum</p>
            {isAdvanced && (
              <p>• Additional Costs: {formatCurrencyPKR(processingFee + insurance + roadTax)}</p>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1" size="lg">
            Apply for Loan
          </Button>
          <Button variant="outline" className="flex-1" size="lg">
            Compare Offers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

EMICalculator.displayName = "EMICalculator"

export { EMICalculator }
