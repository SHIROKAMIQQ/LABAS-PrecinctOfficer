<script lang="ts">
    //@ts-nocheck
    import type { ApexOptions } from 'apexcharts';
    import { Chart } from '@flowbite-svelte-plugins/chart';
    import { Card, A, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ArrowUpOutline, ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

    let { title, candidates } = $props();
    let totalVotes = candidates
        .map((item) => item.vote)
        .reduce((accumulator, current) => accumulator + current, 0);
    let dynamicHeight = $derived(Math.max(300, candidates.length * 25 + 50));

    const options: ApexOptions = {
        series: [
            {
                name: 'Votes',
                color: '#31C48D',
                data: candidates.sort((a, b) => b.vote - a.vote).map((item) => item.vote), // candidate votes
            },
        ],
        chart: {
            sparkline: {
                enabled: false,
            },
            type: 'bar',
            width: '100%',
            height: dynamicHeight,
            toolbar: {
                show: false,
            },
        },
        fill: {
            opacity: 1,
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: '100%',
                borderRadiusApplication: 'end',
                borderRadius: 6,
                dataLabels: {
                    position: 'center',
                },
            },
        },
        legend: {
            show: true,
            position: 'bottom',
        },
        dataLabels: {
            enabled: true,
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
                formatter: (value) => value.toLocaleString(),
            },
            categories: candidates.sort((a, b) => b.vote - a.vote).map((item) => item.name), // candidate names
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
        },
        grid: {
            show: true,
            strokeDashArray: 4,
            padding: {
                left: 10,
                right: 2,
                top: -20,
            },
        },
    };
</script>

<Card class="mt-4 max-w-full! p-4 md:p-6">
    <div class="flex justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
        <dl>
            <dt class="pb-1 text-base font-normal text-gray-500 dark:text-gray-400">Elections</dt>
            <dd class="text-3xl leading-none font-bold text-gray-900 dark:text-white">{title}</dd>
        </dl>
    </div>

    <div class="grid grid-cols-2 py-3">
        <dl>
            <dt class="pb-1 text-base font-normal text-gray-500 dark:text-gray-400">Total Votes</dt>
            <dd class="text-xl leading-none font-bold text-green-500 dark:text-green-400">
                {totalVotes}
            </dd>
        </dl>
    </div>

    <Chart {options} />
</Card>

<!-- <div class="grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between pt-5">
      <Button class="inline-flex items-center bg-transparent py-0 text-center text-sm font-medium text-gray-500 hover:bg-transparent hover:text-gray-900 focus:ring-transparent dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:focus:ring-transparent">Last 7 days<ChevronDownOutline class="m-2.5 ms-1.5 w-2.5" /></Button>
      <Dropdown simple class="w-40" offset={-6}>
        <DropdownItem>Yesterday</DropdownItem>
        <DropdownItem>Today</DropdownItem>
        <DropdownItem>Last 7 days</DropdownItem>
        <DropdownItem>Last 30 days</DropdownItem>
        <DropdownItem>Last 90 days</DropdownItem>
      </Dropdown>
      <A href="/" class="hover:text-primary-700 dark:hover:text-primary-500 rounded-lg px-3 py-2 text-sm font-semibold uppercase hover:bg-gray-100 hover:no-underline dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
        Leads Report
        <ChevronRightOutline class="ms-1.5 h-2.5 w-2.5" />
      </A>
    </div>
  </div> -->
