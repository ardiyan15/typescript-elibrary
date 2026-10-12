export type DependencyName = 'database' | 'redis' | 'rabbitmq'

const dependencyStatus: Record<DependencyName, boolean> = {
    database: true,
    redis: true,
    rabbitmq: true
}

export const setDependencyStatus = (name: DependencyName, available: boolean): void => {
    dependencyStatus[name] = available
}

export const getUnavailableDependencies = (): DependencyName[] =>
    (Object.keys(dependencyStatus) as DependencyName[])
        .filter(name => !dependencyStatus[name])

export const areDependenciesAvailable = (): boolean =>
    getUnavailableDependencies().length === 0
