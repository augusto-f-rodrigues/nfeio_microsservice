import { HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';
import { CreateCcNfeDto } from './dto/create-cc-nfe.dto';

import { Injectable, Logger } from '@nestjs/common';

import { CreateNfeDto } from './dto/create-nfe.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NfeService {

  /**
   * Logger
   */
  private readonly logger = new Logger(NfeService.name);
  /**
   * Constructor
   * @param httpService Http Service to handle requests
   */
  constructor(private readonly httpService: HttpService) {}

  /**
   * Movidesk URL
   * @type {string}
   */
  http: string = process.env.NFE_URL;


  create(createNfeDto: CreateNfeDto) {
    return 'This action adds a new nfe';
  }

  async getNfJson(id: string): Promise<any> {
    const { data } = await lastValueFrom(
      this.httpService.get(
        `${this.http}/${process.env.NFE_COMPANY_ID}/productinvoices/${id}?apikey=${process.env.NFE_API_KEY}`,
      ),
    );

    return data;
  }

  async getNfPdf(id: string): Promise<any> {
    const { data } = await lastValueFrom(
      this.httpService.get(
        `${this.http}/${process.env.NFE_COMPANY_ID}/productinvoices/${id}/pdf?apikey=${process.env.NFE_API_KEY}`,
      ),
    );

    return data;
  }


  /**
   * Function to create a correction letter
   * @param id Product Invoice Id
   * @param createCcDTO Reason to create a correction letter
   * @returns a object like this:
   * ```ts
   * {
   *    accountId: string;
   *    companyId: string;
   *    productInvoiceId: string;
   *    reason: string;
   * }
   * ```
   */
  async createCc(id: string, createCcDTO: CreateCcNfeDto) {
    const { data } = await lastValueFrom<{ data: Nfeio.CreateCcResponse }>(
      this.httpService
        .put(
          `${process.env.NFE_BASE_URL}/${process.env.NFE_COMPANY_ID}/productinvoices/${id}/correctionletter?apikey=${process.env.NFE_API_KEY}`,
          { reason: createCcDTO },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }


  async removeNFE(id: string) {
    const deleteNFE = await this.httpService.delete(
      `${this.httpService}/${process.env.NEF_COMPANY_ID}/productinvoices/${process.env.NFE_TEST_COMPANY_ID}`,
    );
    return deleteNFE;

  }
}
