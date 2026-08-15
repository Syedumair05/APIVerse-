import { Request, Response } from 'express';
import { CountryService } from '../services/countryService';
import { ApiResponse } from '../utils/apiResponse';
import { CountryQueryParams } from '../types/country';

export class CountryController {
  static getCountries = async (req: Request, res: Response) => {
    const queryParams = req.query as unknown as CountryQueryParams;
    const { data, pagination, lastUpdated } = await CountryService.getAllCountries(queryParams);
    return ApiResponse.success(res, data, 'Countries fetched successfully', pagination, 200, lastUpdated);
  };

  static getCountryByCode = async (req: Request, res: Response) => {
    const { code } = req.params;
    const country = await CountryService.getCountryByCode(code);
    return ApiResponse.success(res, country, `Details for ${country.name.common}`);
  };

  static searchCountries = async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const matches = await CountryService.searchCountries(query);
    return ApiResponse.success(res, matches, `Found ${matches.length} matching countries`);
  };

  static getAvailableRegions = async (_req: Request, res: Response) => {
    const regions = await CountryService.getAvailableRegions();
    return ApiResponse.success(res, regions, 'Available regions retrieved successfully');
  };

  static refreshCountries = async (_req: Request, res: Response) => {
    const metadata = await CountryService.refreshDataset();
    return ApiResponse.success(
      res,
      metadata,
      'Country dataset successfully refreshed from REST Countries API',
      undefined,
      200,
      metadata.lastUpdated
    );
  };
}
