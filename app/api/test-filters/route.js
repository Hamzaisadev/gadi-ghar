import { getCarFilters } from "@/app/actions/car-listing";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('🧪 Testing filter data API endpoint...');
    
    const result = await getCarFilters();
    
    console.log('🔍 getCarFilters result:', {
      success: result?.success,
      hasData: !!result?.data,
      makes: result?.data?.makes,
      bodyTypes: result?.data?.bodyTypes,
      fuelTypes: result?.data?.fuelTypes,
      transmissions: result?.data?.transmissions
    });
    
    return NextResponse.json({
      success: true,
      message: 'Filter data test completed',
      data: result
    });
  } catch (error) {
    console.error('❌ Filter test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
