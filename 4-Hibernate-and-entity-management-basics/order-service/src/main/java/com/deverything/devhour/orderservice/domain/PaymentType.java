package com.deverything.devhour.orderservice.domain;

import java.io.Serializable;

public enum PaymentType implements Serializable {
    CARD, INVOICE, SWISH, TRANSFER
}
