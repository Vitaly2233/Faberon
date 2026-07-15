import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../../../common/errors/error-response.dto';
import { BillingInformationService } from '../../application/billing-information.service';
import { ContactService } from '../../application/contact.service';
import { CustomerService } from '../../application/customer.service';
import { CustomerNotFoundError } from '../../domain/customer.errors';
import {
  BillingInformationResponse,
  CreateBillingInformationRequest,
} from './billing-information.dto';
import { ContactResponse, CreateContactRequest } from './contact.dto';
import {
  CreateCustomerRequest,
  CustomerResponse,
} from './customer.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly contactService: ContactService,
    private readonly billingInformationService: BillingInformationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiOkResponse({ type: CustomerResponse, isArray: true })
  findAll(): Promise<CustomerResponse[]> {
    return this.customerService.findAll();
  }

  @Get(':customerId')
  @ApiOperation({ summary: 'Get a customer' })
  @ApiOkResponse({ type: CustomerResponse })
  @ApiBadRequestResponse({ description: 'The customer ID is not a UUIDv7.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  async findById(
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
  ): Promise<CustomerResponse> {
    const customer = await this.customerService.findById(customerId);
    if (!customer) throw new CustomerNotFoundError(customerId);
    return customer;
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiCreatedResponse({ type: CustomerResponse })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  create(@Body() request: CreateCustomerRequest): Promise<CustomerResponse> {
    return this.customerService.create(request);
  }

  @Post(':customerId/contact')
  @ApiOperation({ summary: 'Create the customer contact' })
  @ApiCreatedResponse({ type: ContactResponse })
  @ApiBadRequestResponse({ description: 'The request or customer ID is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse })
  createContact(
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
    @Body() request: CreateContactRequest,
  ): Promise<ContactResponse> {
    return this.contactService.create(customerId, request);
  }

  @Post(':customerId/billing-information')
  @ApiOperation({ summary: 'Create the customer billing information' })
  @ApiCreatedResponse({ type: BillingInformationResponse })
  @ApiBadRequestResponse({ description: 'The request or customer ID is invalid.' })
  @ApiNotFoundResponse({ type: ErrorResponse })
  @ApiConflictResponse({ type: ErrorResponse })
  createBillingInformation(
    @Param('customerId', new ParseUUIDPipe({ version: '7' }))
    customerId: string,
    @Body() request: CreateBillingInformationRequest,
  ): Promise<BillingInformationResponse> {
    return this.billingInformationService.create(customerId, request);
  }
}
