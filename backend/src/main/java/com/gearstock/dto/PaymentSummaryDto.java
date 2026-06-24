package com.gearstock.dto;

import java.math.BigDecimal;

public class PaymentSummaryDto {
    private BigDecimal cashTotal = BigDecimal.ZERO;
    private BigDecimal upiTotal = BigDecimal.ZERO;
    private BigDecimal cardTotal = BigDecimal.ZERO;
    private BigDecimal bankTransferTotal = BigDecimal.ZERO;
    private BigDecimal lendingTotal = BigDecimal.ZERO;
    private BigDecimal overallTotal = BigDecimal.ZERO;

    public PaymentSummaryDto() {
    }

    public PaymentSummaryDto(BigDecimal cashTotal, BigDecimal upiTotal, BigDecimal cardTotal, BigDecimal bankTransferTotal, BigDecimal lendingTotal, BigDecimal overallTotal) {
        this.cashTotal = cashTotal;
        this.upiTotal = upiTotal;
        this.cardTotal = cardTotal;
        this.bankTransferTotal = bankTransferTotal;
        this.lendingTotal = lendingTotal;
        this.overallTotal = overallTotal;
    }

    public BigDecimal getCashTotal() {
        return cashTotal;
    }

    public void setCashTotal(BigDecimal cashTotal) {
        this.cashTotal = cashTotal;
    }

    public BigDecimal getUpiTotal() {
        return upiTotal;
    }

    public void setUpiTotal(BigDecimal upiTotal) {
        this.upiTotal = upiTotal;
    }

    public BigDecimal getCardTotal() {
        return cardTotal;
    }

    public void setCardTotal(BigDecimal cardTotal) {
        this.cardTotal = cardTotal;
    }

    public BigDecimal getBankTransferTotal() {
        return bankTransferTotal;
    }

    public void setBankTransferTotal(BigDecimal bankTransferTotal) {
        this.bankTransferTotal = bankTransferTotal;
    }

    public BigDecimal getLendingTotal() {
        return lendingTotal;
    }

    public void setLendingTotal(BigDecimal lendingTotal) {
        this.lendingTotal = lendingTotal;
    }

    public BigDecimal getOverallTotal() {
        return overallTotal;
    }

    public void setOverallTotal(BigDecimal overallTotal) {
        this.overallTotal = overallTotal;
    }
}
